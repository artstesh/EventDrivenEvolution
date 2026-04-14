import {Component, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {CloseModalsCommand} from '../../../messages/commands/close-modals.command';
import {ListOrderHistoryQuery} from '../../../messages/queries/list-order-history.query';
import {OrderHistoryVm} from '../../../models/order-history-vm';

@Component({
  selector: 'app-order-history-modal',
  standalone: true,
  imports: [    DatePipe  ],
  templateUrl: './order-history-modal.html',
  styleUrl: './order-history-modal.scss',
})
export class OrderHistoryModal implements OnInit{
  orders = signal<OrderHistoryVm[]>([]);

  constructor(private readonly postboy: AppPostboyService) {
  }

  close(): void {
    this.postboy.fire(new CloseModalsCommand());
  }

  ngOnInit(): void {
    this.postboy.fireCallback(new ListOrderHistoryQuery()).subscribe(orders => this.orders.set(orders));
  }
}
