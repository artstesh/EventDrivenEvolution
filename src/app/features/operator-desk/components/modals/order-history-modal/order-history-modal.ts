import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal} from '@angular/core';
import {OperatorSessionModel} from '../../../models/operator-session.model';
import {CustomerModel} from '../../../models/customer.model';
import {Subscription} from 'rxjs';
import {CallRoutingService} from '../../../services/call-routing';
import {OperatorSessionFacade} from '../../../facades/operator-session.facade';
import {ModalFacade} from '../../../facades/modal.facade';

@Component({
  selector: 'app-order-history-modal',
  standalone: true,
  imports: [

  ],
  templateUrl: './order-history-modal.html',
  styleUrl: './order-history-modal.scss',
})
export class OrderHistoryModal implements OnInit, OnDestroy{
  private subs: Subscription[] = [];

  constructor(private readonly modalFacade: ModalFacade) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.modalFacade.close();
  }

  ngOnInit(): void {

  }
}
