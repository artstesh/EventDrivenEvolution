import { Injectable } from '@angular/core';

export interface CustomerDto {
  id: string;
  fullName: string;
  isVip: boolean;
  balanceAmount: number;
  balanceCurrency: 'RUB' | 'USD' | 'EUR';
  loyaltyLevel?: string;
  segment?: string;
  lastOrderAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerApiAdapter {
  async getCustomer(customerId: string): Promise<CustomerDto> {
    void customerId;

    return {
      id: 'cust-001',
      fullName: 'Алексей Иванов',
      isVip: true,
      balanceAmount: 12450,
      balanceCurrency: 'RUB',
      loyaltyLevel: 'Высокая',
      segment: 'Premium',
      lastOrderAt: '2026-04-10T09:15:00.000Z',
    };
  }

  async getCustomerHistory(customerId: string): Promise<Array<{ id: string; orderNumber: string; createdAt: string; status: string; totalAmount: number }>> {
    void customerId;

    return [
      { id: 'order-10482', orderNumber: '10482', createdAt: '2026-04-12T11:20:00.000Z', status: 'delivered', totalAmount: 56470 },
      { id: 'order-10411', orderNumber: '10411', createdAt: '2026-03-28T14:40:00.000Z', status: 'closed', totalAmount: 18990 },
      { id: 'order-10367', orderNumber: '10367', createdAt: '2026-03-11T08:05:00.000Z', status: 'returned', totalAmount: 7500 },
    ];
  }
}
