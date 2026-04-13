import { Injectable } from '@angular/core';
import {CustomerDto} from './models/customer-dto';
import {ReplaySubject} from 'rxjs';
import {CustomerHistory} from './models/customer-history';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiAdapter {
  private _customer!: CustomerDto;
  public customer$ = new ReplaySubject<CustomerDto>(1);

  constructor() {
    this.getNextCustomer();
  }

  getNextCustomer(): void {
    this._customer = {
      id: `cust-${Math.round(Math.random()*10000)}`,
      balanceAmount: Math.round(Math.random()*100000),
      balanceCurrency: Math.round(Math.random()*3),
      isVip: Math.random() > 0.5,
      fullName: `Customer ${Math.round(Math.random()*10000)}`,
      segment: Math.random() > 0.5 ? 'Premium' : 'Standard',
      lastOrderAt: new Date(new Date().getTime() - Math.round(Math.random()*100000000000)).toISOString(),
      loyaltyLevel: Math.random() > 0.5 ? 'High' : 'Low',
    };
    this.customer$.next(this._customer);
  }

  async getCustomer(customerId: string): Promise<CustomerDto> {
    return this._customer;
  }

  async getCustomerHistory(customerId: string): Promise<Array<CustomerHistory>> {
    return Array.from({length: 3}, (_, i) => ({
      id: `order-${Math.round(Math.random()*10000)}`,
      orderNumber: `104${Math.round(Math.random()*100)}`,
      createdAt: new Date(new Date().getTime() - Math.round(Math.random()*1000000000000)).toISOString(),
      status: Math.random() > 0.5 ? 'delivered' : 'closed',
      totalAmount: Math.round(Math.random()*100000),
    }));
  }
}
