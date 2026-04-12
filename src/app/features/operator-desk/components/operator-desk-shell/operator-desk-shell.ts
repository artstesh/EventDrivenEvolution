import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperatorHeader } from '../operator-header/operator-header';
import { CallStatusPanel } from '../call-panel/call-status-panel/call-status-panel';
import { CustomerProfileWidget } from '../customer-profile/customer-profile-widget/customer-profile-widget';
import { CartWidgetComponent, CartWidgetVm } from '../cart-widget/cart-widget.component';
import { CatalogSearchPanelComponent, CatalogSearchCriteria } from '../catalog/catalog-search-panel/catalog-search-panel.component';
import { ProductGrid, ProductCardVm } from '../catalog/product-grid/product-grid';
import { ConfirmDiscountModal } from '../modals/confirm-discount-modal/confirm-discount-modal';
import { OrderHistoryModal } from '../modals/order-history-modal/order-history-modal';
import { OperatorStatusSwitch, OperatorStatus } from '../call-panel/operator-status-switch/operator-status-switch';

@Component({
  selector: 'app-operator-desk-shell',
  standalone: true,
  imports: [
    OperatorHeader,
    CallStatusPanel,
    CustomerProfileWidget,
    CartWidgetComponent,
    CatalogSearchPanelComponent,
    ProductGrid,
    ConfirmDiscountModal,
    OrderHistoryModal,
    OperatorStatusSwitch,
  ],
  templateUrl: './operator-desk-shell.html',
  styleUrl: './operator-desk-shell.scss',
})
export class OperatorDeskShell {
  @Input() operatorStatus: OperatorStatus = 'working';
  @Input() queueSize = 0;
  @Input() shiftLabel = '08:00–20:00';

  @Input() callTitle = 'Клиент подключён';
  @Input() customerName = 'Алексей Иванов';
  @Input() isVip = true;
  @Input() balance = '12 450 ₽';
  @Input() callStatus = 'Обрабатывается';
  @Input() callDuration = '00:08:42';

  @Input() fullName = 'Алексей Иванов';
  @Input() loyaltyLevel = 'Высокая';
  @Input() segment = 'Premium';
  @Input() lastOrderAt = '2 дня назад';

  @Input() cartItemCount = 0;
  @Input() cartDiscount = '0 ₽';
  @Input() cartSubtotal = '0 ₽';
  @Input() cartTotal = '0 ₽';
  @Input() cartItems: CartWidgetVm['items'] = [];

  @Input() products: ProductCardVm[] = [];
  @Input() totalCount = 0;
  @Input() displayedCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;

  @Input() showConfirmDiscountModal = false;
  @Input() showOrderHistoryModal = false;

  @Output() operatorStatusChanged = new EventEmitter<OperatorStatus>();
  @Output() searchRequested = new EventEmitter<CatalogSearchCriteria>();
  @Output() addToCart = new EventEmitter<ProductCardVm>();
  @Output() endCall = new EventEmitter<void>();
  @Output() openOrder = new EventEmitter<void>();
  @Output() closeConfirmDiscountModal = new EventEmitter<void>();
  @Output() closeOrderHistoryModal = new EventEmitter<void>();
  @Output() confirmDiscount = new EventEmitter<string>();
}
