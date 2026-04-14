import {Injectable} from '@angular/core';
import {Currency} from './models/currency.enum';

export interface OrderConfirmationRequestDto {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPriceAmount: number;
  }>;
  discountReason?: string;
}

export interface OrderConfirmationResponseDto {
  orderId: string;
  orderNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmedAt: Date;
  totalAmount: number;
  totalCurrency: Currency;
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
      confirmedAt: new Date(),
      totalAmount: 51470,
      totalCurrency: Currency.USD,
    };
  }

  async getOrderHistory(customerId: string): Promise<Array<{
    orderId: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    totalAmount: number
  }>> {
    void customerId;

    return Array.from({length: 4}).map(() => ({
      orderId: `order-${Math.round(Math.random()*10000)}`,
      orderNumber: Math.round(Math.random()*10000)+'',
      createdAt: new Date(new Date().getTime() - Math.round(Math.random()*1000000000000)).toISOString(),
      status: Math.random() > 0.5 ? 'delivered' : 'closed',
      totalAmount: Math.round(Math.random()*20000)+900
    }));
  }
}
