import {Component, EventEmitter, Output} from '@angular/core';
import {OperatorHeader} from '../operator-header/operator-header';
import {CallStatusPanel} from '../call-panel/call-status-panel/call-status-panel';
import {CustomerProfileWidget} from '../customer-profile/customer-profile-widget/customer-profile-widget';
import {CartWidgetComponent} from '../cart-widget/cart-widget.component';
import {CatalogSearchPanelComponent} from '../catalog/catalog-search-panel/catalog-search-panel.component';
import {ProductGrid} from '../catalog/product-grid/product-grid';
import {OperatorStatus, OperatorStatusSwitch} from '../call-panel/operator-status-switch/operator-status-switch';
import {ModalHostComponent} from '../modal-host/modal-host.component';
import {OpenModalCommand} from '../../messages/commands/open-modal.command';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {EndCallCommand} from '../../messages/commands/end-call.command';

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
  @Output() operatorStatusChanged = new EventEmitter<OperatorStatus>();

  constructor(private readonly postboy: AppPostboyService) {
  }

  placeOrder(): void {
    this.postboy.fire(new OpenModalCommand('confirm-discount'));
  }

  endCall(): void {
    this.postboy.fire(new EndCallCommand());
  }
}
