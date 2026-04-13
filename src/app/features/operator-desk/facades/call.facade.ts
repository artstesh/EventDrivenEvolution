import {Injectable} from '@angular/core';
import {CallModel} from '../models/call.model';
import {CustomerModel} from '../models/customer.model';
import {OperatorStatus} from '../components/call-panel/operator-status-switch/operator-status-switch';
import {CallRoutingService} from '../services/call-routing';
import {NotificationService} from '../services/notification';
import {CustomerApiAdapter} from '../adapters/api/customer-api.adapter';
import {CustomerDto} from '../adapters/api/models/customer-dto';
import {CustomerMapper} from '../mappers/customer.mapper';

@Injectable({
  providedIn: 'root',
})
export class CallFacade {
  constructor(
    private readonly callRoutingService: CallRoutingService,
    private readonly notificationService: NotificationService,
    private readonly customerAdapter: CustomerApiAdapter,
    private readonly customerMapper: CustomerMapper
  ) {
    this.customerAdapter.customer$.subscribe((customer) => this.nextCustomer(customer))
  }

  get operatorStatus(): OperatorStatus {
    return this.callRoutingService.getOperatorStatus();
  }

  nextCustomer(customer: CustomerDto): void {
    this.callRoutingService.startCall(this.customerMapper.mapDtoToModel(customer));
    this.notificationService.push({
      type: 'info',
      title: 'Income call',
      message: `Client ${customer.fullName} is on air.`,
    });
  }

  endCall(): void {
    this.callRoutingService.endCall();

    this.notificationService.push({
      type: 'info',
      title: 'The call is ended',
      message: 'The current contact has been closed, and the session cleared.',
    });
    this.customerAdapter.getNextCustomer();
  }

  async getCustomerHistory(customerId: string): Promise<Array<{
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    totalAmount: number
  }>> {
    return this.customerAdapter.getCustomerHistory(customerId);
  }

  async getCustomerProfile(customerId: string): Promise<CustomerModel> {
    return this.customerMapper.mapDtoToModel(await this.customerAdapter.getCustomer(customerId));
  }
}
