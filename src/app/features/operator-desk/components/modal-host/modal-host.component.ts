import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {ConfirmDiscountModal} from '../modals/confirm-discount-modal/confirm-discount-modal';
import {OrderHistoryModal} from '../modals/order-history-modal/order-history-modal';
import {OperatorSessionModal} from '../modals/operator-session-modal/operator-session-modal';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {ModalType} from '../../models/modal.model';
import {Subscription} from 'rxjs';
import {CloseModalsCommand} from '../../messages/commands/close-modals.command';
import {ModalStateEvent} from '../../messages/events/modal-state.event';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [ConfirmDiscountModal, OrderHistoryModal, OperatorSessionModal],
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.scss',
})
export class ModalHostComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  active = signal<ModalType | null>(null);

  constructor(private readonly postboy: AppPostboyService) {
  }

  close(): void {
    this.postboy.fire(new CloseModalsCommand());
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ModalStateEvent).subscribe(c => this.active.set(c.type)))
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
