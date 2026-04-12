import { Component, OnInit } from '@angular/core';
import { OperatorDeskShell } from '../../components/operator-desk-shell/operator-desk-shell';
import { ToastCenter } from '../../components/toast-center/toast-center';
import { OperatorStatus } from '../../components/call-panel/operator-status-switch/operator-status-switch';
import { ProductCardVm } from '../../components/catalog/product-grid/product-grid';
import { CatalogSearchCriteria } from '../../components/catalog/catalog-search-panel/catalog-search-panel.component';
import { CatalogFacade } from '../../facades/catalog.facade';
import { CartFacade } from '../../facades/cart.facade';
import { ModalFacade } from '../../facades/modal.facade';
import { OperatorSessionFacade } from '../../facades/operator-session.facade';
import { NotificationFacade } from '../../facades/notification.facade';
import { ProductMapper } from '../../mappers/product.mapper';
import { CartWidgetVm } from '../../components/cart-widget/cart-widget.component';
import { CartModel } from '../../models/cart.model';
import { DiscountApprovalService } from '../../services/discount-approval';

@Component({
  selector: 'app-operator-desk-page',
  standalone: true,
  imports: [OperatorDeskShell, ToastCenter],
  templateUrl: './operator-desk-page.html',
  styleUrl: './operator-desk-page.scss',
})
export class OperatorDeskPage implements OnInit {
  operatorStatus: OperatorStatus = 'working';

  queueSize = 3;
  shiftLabel = '08:00–20:00';

  callTitle = 'Клиент подключён';
  customerName = 'Алексей Иванов';
  isVip = true;
  balance = '12 450 ₽';
  callStatus = 'Обрабатывается';
  callDuration = '00:08:42';

  fullName = 'Алексей Иванов';
  loyaltyLevel = 'Высокая';
  segment = 'Premium';
  lastOrderAt = '2 дня назад';

  cartItemCount = 0;
  cartDiscount = '0 ₽';
  cartSubtotal = '0 ₽';
  cartTotal = '0 ₽';
  cartItems: CartWidgetVm['items'] = [];

  totalCount = 0;
  displayedCount = 0;
  currentPage = 1;
  totalPages = 1;

  products: ProductCardVm[] = [];

  showConfirmDiscountModal = false;
  showOrderHistoryModal = false;

  constructor(
    private readonly operatorSessionFacade: OperatorSessionFacade,
    private readonly catalogFacade: CatalogFacade,
    private readonly cartFacade: CartFacade,
    private readonly modalFacade: ModalFacade,
    private readonly notificationFacade: NotificationFacade,
    private readonly discountApprovalService: DiscountApprovalService,
    private readonly productMapper: ProductMapper,
  ) {}

  async ngOnInit(): Promise<void> {
    this.operatorStatus = this.operatorSessionFacade.status;
    this.syncCartView();

    await this.loadCatalog();
    this.catalogFacade.startStockFeed((event) => {
      this.products = this.products.map((product) =>
        product.sku !== event.productId
          ? product
          : {
            ...product,
            stockState: event.stockStatus,
            stockLabel:
              event.stockStatus === 'available'
                ? 'В наличии'
                : event.stockStatus === 'limited'
                  ? 'Ограничено'
                  : 'Нет в наличии',
          },
      );
    });
  }

  async loadCatalog(criteria: CatalogSearchCriteria = this.defaultCriteria()): Promise<void> {
    const result = await this.catalogFacade.search(criteria);

    this.products = result.items;
    this.totalCount = result.total;
    this.displayedCount = result.items.length;
    this.currentPage = result.page;
    this.totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  }

  onOperatorStatusChanged(status: OperatorStatus): void {
    this.operatorStatus = this.operatorSessionFacade.setStatus(status);
  }

  onSearchRequested(criteria: CatalogSearchCriteria): void {
    void this.loadCatalog(criteria);
  }

  onAddToCart(product: ProductCardVm): void {
    const domainProduct = this.productMapper.toDomainProduct(product);
    this.cartFacade.addItem(domainProduct);
    this.syncCartView();
  }

  onEndCall(): void {
    this.modalFacade.closeAll();
    this.cartFacade.clearCart();
    this.operatorSessionFacade.setStatus('working');
    this.syncCartView();

    this.notificationFacade.push({
      type: 'info',
      title: 'Сессия завершена',
      message: 'Данные клиента и корзина очищены.',
    });
  }

  onOpenOrder(): void {
    this.showConfirmDiscountModal = true;
    this.modalFacade.open('confirm-discount');
  }

  onCloseConfirmDiscountModal(): void {
    this.showConfirmDiscountModal = false;
    this.modalFacade.close();
  }

  onConfirmDiscount(reason: string): void {
    const discountReason = this.discountApprovalService.createDiscountReason(reason);

    this.notificationFacade.push({
      type: 'success',
      title: 'Скидка подтверждена',
      message: discountReason.text || 'Причина скидки не указана.',
    });

    this.showConfirmDiscountModal = false;
    this.modalFacade.close();
  }

  onCloseOrderHistoryModal(): void {
    this.showOrderHistoryModal = false;
    this.modalFacade.close();
  }

  private syncCartView(): void {
    const vm = this.cartFacade.cartVm;

    this.cartItemCount = vm.itemCount;
    this.cartDiscount = vm.discount;
    this.cartSubtotal = vm.subtotal;
    this.cartTotal = vm.total;
    this.cartItems = vm.items;
  }

  private defaultCriteria(): CatalogSearchCriteria {
    return {
      query: '',
      category: 'Все категории',
      availability: 'Все',
      preset: 'Популярное',
    };
  }
}
