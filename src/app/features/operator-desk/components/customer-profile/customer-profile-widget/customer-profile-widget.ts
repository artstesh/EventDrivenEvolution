import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {CustomerModel} from '../../../models/customer.model';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {OpenModalCommand} from '../../../messages/commands/open-modal.command';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {CallEvent} from '../../../messages/events/call.event';

@Component({
  selector: 'app-customer-profile-widget',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './customer-profile-widget.html',
  styleUrl: './customer-profile-widget.scss',
})
export class CustomerProfileWidget implements OnInit, OnDestroy {
  customer = signal<CustomerModel | null>(null);
  private subs: Subscription[] = [];

  constructor(private readonly postboy: AppPostboyService) {
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(CallEvent).subscribe(ev => {
      this.customer.set(ev.call?.customer || null);
    }));
  }

  showOrderHistory(): void {
    this.postboy.fire(new OpenModalCommand('order-history'));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
