import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal} from '@angular/core';
import {OperatorSessionModel} from '../../../models/operator-session.model';
import {CustomerModel} from '../../../models/customer.model';
import {Subscription} from 'rxjs';
import {CallRoutingService} from '../../../services/call-routing';
import {OperatorSessionFacade} from '../../../facades/operator-session.facade';
import {ModalFacade} from '../../../facades/modal.facade';
import {OrderFacade} from '../../../facades/order.facade';
import {OrderHistoryVm} from '../../../mappers/order.mapper';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-order-history-modal',
  standalone: true,
  imports: [
    DatePipe

  ],
  templateUrl: './order-history-modal.html',
  styleUrl: './order-history-modal.scss',
})
export class OrderHistoryModal implements OnInit, OnDestroy{
  private subs: Subscription[] = [];
  orders = signal<OrderHistoryVm[]>([]);
  customer = signal<CustomerModel | null>(null);

  constructor(private readonly modalFacade: ModalFacade,
              private readonly orderFacade: OrderFacade,
              private readonly callRoutingService: CallRoutingService,) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.modalFacade.close();
  }

  async ngOnInit(): Promise<void> {
    this.orders.set(await this.orderFacade.getOrderHistory());
    this.subs.push(this.callRoutingService.activeCall$.subscribe(call => {
      this.customer.set(call?.customer || null);
    }));
  }
}
