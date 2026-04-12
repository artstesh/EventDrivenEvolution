import { Injectable } from '@angular/core';
import { CallModel } from '../models/call.model';
import { CustomerModel } from '../models/customer.model';
import { OperatorStatus } from '../components/call-panel/operator-status-switch/operator-status-switch';
import {CallRoutingService} from '../services/call-routing';
import {CustomerProfileService} from '../services/customer-profile';
import {NotificationService} from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class CallFacade {
  constructor(
    private readonly callRoutingService: CallRoutingService,
    private readonly customerProfileService: CustomerProfileService,
    private readonly notificationService: NotificationService,
  ) {}

  get activeCall(): CallModel | null {
    return this.callRoutingService.getActiveCall();
  }

  get operatorStatus(): OperatorStatus {
    return this.callRoutingService.getOperatorStatus();
  }

  async loadCustomer(customerId: string): Promise<CustomerModel> {
    const customer = await this.customerProfileService.getCustomer(customerId);

    this.callRoutingService.startCall(customer);
    this.notificationService.push({
      type: 'info',
      title: 'Входящий звонок',
      message: `Клиент ${customer.fullName} подключён.`,
    });

    return customer;
  }

  endCall(): CallModel | null {
    const ended = this.callRoutingService.endCall();

    this.notificationService.push({
      type: 'info',
      title: 'Звонок завершён',
      message: 'Текущий контакт был закрыт, сессия очищена.',
    });

    return ended;
  }

  async getCustomerHistory(customerId: string) {
    return this.customerProfileService.getCustomerHistory(customerId);
  }

  async getCustomerProfile(customerId: string) {
    return this.customerProfileService.getCustomerProfile(customerId);
  }
}
