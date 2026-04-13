import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {OperatorHeader} from '../operator-header/operator-header';
import {CallStatusPanel} from '../call-panel/call-status-panel/call-status-panel';
import {CustomerProfileWidget} from '../customer-profile/customer-profile-widget/customer-profile-widget';
import {CartWidgetComponent, CartWidgetVm} from '../cart-widget/cart-widget.component';
import {
  CatalogSearchCriteria,
  CatalogSearchPanelComponent
} from '../catalog/catalog-search-panel/catalog-search-panel.component';
import {ProductCardVm, ProductGrid} from '../catalog/product-grid/product-grid';
import {OperatorStatus, OperatorStatusSwitch} from '../call-panel/operator-status-switch/operator-status-switch';
import {ModalHostComponent} from '../modal-host/modal-host.component';
import {ModalFacade} from '../../facades/modal.facade';

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
    OperatorStatusSwitch,
    ModalHostComponent,
  ],
  templateUrl: './operator-desk-shell.html',
  styleUrl: './operator-desk-shell.scss',
})
export class OperatorDeskShell {
  @Input() queueSize = 0;
  @Input() shiftLabel = '08:00–20:00';

  @Input() products: ProductCardVm[] = [];
  @Input() totalCount = 0;
  @Input() displayedCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;

  @Output() operatorStatusChanged = new EventEmitter<OperatorStatus>();
  @Output() searchRequested = new EventEmitter<CatalogSearchCriteria>();
  @Output() addToCart = new EventEmitter<ProductCardVm>();
  @Output() endCall = new EventEmitter<void>();

  constructor(private readonly modalFacade: ModalFacade) {
  }

  placeOrder(): void {
    this.modalFacade.open('confirm-discount');
  }
}
