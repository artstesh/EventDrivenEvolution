import {Component, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {CloseModalsCommand} from '../../../messages/commands/close-modals.command';
import {ListOrderHistoryQuery} from '../../../messages/queries/list-order-history.query';
import {OrderHistoryVm} from '../../../models/order-history-vm';
import {CallEvent} from '../../../messages/events/call.event';
import {CallModel} from '../../../models/call.model';

@Component({
  selector: 'app-order-history-modal',
  standalone: true,
  imports: [    DatePipe  ],
  templateUrl: './order-history-modal.html',
  styleUrl: './order-history-modal.scss',
})
export class OrderHistoryModal implements OnInit{
  orders = signal<OrderHistoryVm[]>([]);
  activeCall = signal<CallModel | null>(null);

  constructor(private readonly postboy: AppPostboyService) {
  }

  close(): void {
    this.postboy.fire(new CloseModalsCommand());
  }

  ngOnInit(): void {
    this.postboy.sub(CallEvent).subscribe(ev => {
      this.activeCall.set(ev.call);
    });
    this.postboy.fireCallback(new ListOrderHistoryQuery()).subscribe(orders => {
      this.orders.set(orders)
    });
  }
}
