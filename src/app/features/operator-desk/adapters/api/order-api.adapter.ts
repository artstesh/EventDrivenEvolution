import { Injectable } from '@angular/core';

export interface OrderConfirmationRequestDto {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPriceAmount: number;
    unitPriceCurrency: 'RUB' | 'USD' | 'EUR';
  }>;
  discountReason?: string;
}

export interface OrderConfirmationResponseDto {
  orderId: string;
  orderNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmedAt: string;
  totalAmount: number;
  totalCurrency: 'RUB' | 'USD' | 'EUR';
}

@Injectable({
  providedIn: 'root',
})
export class OrderApiAdapter {
  async confirmOrder(request: OrderConfirmationRequestDto): Promise<OrderConfirmationResponseDto> {
    void request;

    return {
      orderId: 'order-10483',
      orderNumber: '10483',
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      totalAmount: 51470,
      totalCurrency: 'RUB',
    };
  }

  async getOrderHistory(customerId: string): Promise<Array<{ orderId: string; orderNumber: string; createdAt: string; status: string; totalAmount: number }>> {
    void customerId;

    return [
      { orderId: 'order-10482', orderNumber: '10482', createdAt: '2026-04-12T11:20:00.000Z', status: 'delivered', totalAmount: 56470 },
      { orderId: 'order-10411', orderNumber: '10411', createdAt: '2026-03-28T14:40:00.000Z', status: 'closed', totalAmount: 18990 },
    ];
  }
}
