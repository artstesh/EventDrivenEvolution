import {Component, OnInit} from '@angular/core';
import {OperatorDeskShell} from '../../components/operator-desk-shell/operator-desk-shell';
import {ToastCenter} from '../../components/toast-center/toast-center';
import {ProductCardVm} from '../../components/catalog/product-grid/product-grid';
import {CatalogSearchCriteria} from '../../components/catalog/catalog-search-panel/catalog-search-panel.component';
import {CatalogFacade} from '../../facades/catalog.facade';
import {CartFacade} from '../../facades/cart.facade';
import {ModalFacade} from '../../facades/modal.facade';
import {OperatorSessionFacade} from '../../facades/operator-session.facade';
import {NotificationFacade} from '../../facades/notification.facade';
import {ProductMapper} from '../../mappers/product.mapper';
import {CartWidgetVm} from '../../components/cart-widget/cart-widget.component';
import {DiscountApprovalService} from '../../services/discount-approval';
import {CallFacade} from '../../facades/call.facade';

@Component({
  selector: 'app-operator-desk-page',
  standalone: true,
  imports: [OperatorDeskShell, ToastCenter],
  templateUrl: './operator-desk-page.html',
  styleUrl: './operator-desk-page.scss',
})
export class OperatorDeskPage implements OnInit {
  queueSize = 3;
  shiftLabel = '08:00–20:00';

  totalCount = 0;
  displayedCount = 0;
  currentPage = 1;
  totalPages = 1;

  products: ProductCardVm[] = [];

  constructor(
    private readonly operatorSessionFacade: OperatorSessionFacade,
    private readonly catalogFacade: CatalogFacade,
    private readonly cartFacade: CartFacade,
    private readonly notificationFacade: NotificationFacade,
    private readonly productMapper: ProductMapper,
    private readonly modalFacade: ModalFacade,
    private readonly callFacade: CallFacade,
  ) {}

  async ngOnInit(): Promise<void> {
    this.notificationFacade.push({
      type: 'info',
      title: 'The workspace is ready',
      message: 'Operator Panel is loaded',
    });

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
                ? 'Available'
                : event.stockStatus === 'limited'
                  ? 'Limited'
                  : 'Out',
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

  onSearchRequested(criteria: CatalogSearchCriteria): void {
    void this.loadCatalog(criteria);
  }

  onAddToCart(product: ProductCardVm): void {
    const domainProduct = this.productMapper.toDomainProduct(product);
    this.cartFacade.addItem(domainProduct);
  }

  onEndCall(): void {
    this.modalFacade.closeAll();
    this.cartFacade.clearCart();
    this.callFacade.endCall();
    this.operatorSessionFacade.setStatus('working');

    this.notificationFacade.push({
      type: 'info',
      title: 'Session is over',
      message: 'Client data and shopping cart cleared.',
    });
  }

  private defaultCriteria(): CatalogSearchCriteria {
    return {
      query: '',
      category: 'Phones',
      availability: 'All',
      preset: 'Popular',
    };
  }
}
