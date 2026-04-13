import {Component} from '@angular/core';
import {ModalFacade} from '../../facades/modal.facade';
import {ConfirmDiscountModal} from '../modals/confirm-discount-modal/confirm-discount-modal';
import {OrderHistoryModal} from '../modals/order-history-modal/order-history-modal';
import {OperatorSessionModal} from '../modals/operator-session-modal/operator-session-modal';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [ConfirmDiscountModal, OrderHistoryModal, OperatorSessionModal],
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.scss',
})
export class ModalHostComponent {
  constructor(private readonly modalFacade: ModalFacade) {}

  get activeModal(): string | null {
    return this.modalFacade.activeModal;
  }

  close(): void {
    this.modalFacade.closeAll();
  }
}
