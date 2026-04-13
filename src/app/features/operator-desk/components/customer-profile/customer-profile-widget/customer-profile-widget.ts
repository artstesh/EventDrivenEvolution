import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {CallRoutingService} from '../../../services/call-routing';
import {CustomerModel} from '../../../models/customer.model';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {ModalFacade} from '../../../facades/modal.facade';

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

  constructor(private readonly callRoutingService: CallRoutingService,
              private readonly modalFacade: ModalFacade) {
  }

  ngOnInit(): void {
    this.subs.push(this.callRoutingService.activeCall$.subscribe(call => {
      this.customer.set(call?.customer || null);
    }));
  }

  showOrderHistory(): void {
    this.modalFacade.open('order-history');
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
