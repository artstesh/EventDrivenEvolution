import { Injectable } from '@angular/core';
import { CustomerApiAdapter } from '../adapters/api/customer-api.adapter';
import { CustomerMapper, CustomerProfileVm } from '../mappers/customer.mapper';
import { CustomerModel } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerProfileService {
  constructor(
    private readonly customerApiAdapter: CustomerApiAdapter,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async getCustomer(customerId: string): Promise<CustomerModel> {
    const dto = await this.customerApiAdapter.getCustomer(customerId);
    return this.customerMapper.mapDtoToModel(dto);
  }

  async getCustomerProfile(customerId: string): Promise<CustomerProfileVm> {
    const dto = await this.customerApiAdapter.getCustomer(customerId);
    const model = this.customerMapper.mapDtoToModel(dto);
    return this.customerMapper.mapModelToProfileVm(model);
  }

  async getCustomerHistory(customerId: string): Promise<Array<{ id: string; orderNumber: string; createdAt: string; status: string; totalAmount: number }>> {
    return this.customerApiAdapter.getCustomerHistory(customerId);
  }
}
