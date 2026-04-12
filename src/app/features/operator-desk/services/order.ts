import { Injectable } from '@angular/core';
import { OrderApiAdapter, OrderConfirmationRequestDto, OrderConfirmationResponseDto } from '../adapters/api/order-api.adapter';
import { CartModel } from '../models/cart.model';
import { CustomerModel } from '../models/customer.model';
import { DiscountReasonModel } from '../models/discount-reason.model';
import { OrderModel } from '../models/order.model';
import { OrderMapper, OrderHistoryVm } from '../mappers/order.mapper';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private readonly orderApiAdapter: OrderApiAdapter,
    private readonly orderMapper: OrderMapper,
  ) {}

  async confirmOrder(customer: CustomerModel, cart: CartModel, discountReason?: DiscountReasonModel): Promise<OrderModel> {
    const request: OrderConfirmationRequestDto = {
      customerId: customer.id,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPriceAmount: item.unitPrice.amount,
        unitPriceCurrency: item.unitPrice.currency,
      })),
      discountReason: discountReason?.text,
    };

    const response: OrderConfirmationResponseDto = await this.orderApiAdapter.confirmOrder(request);
    return this.orderMapper.mapConfirmationResponseToModel(response, customer, cart, discountReason);
  }

  async getOrderHistory(customerId: string): Promise<OrderHistoryVm[]> {
    const history = await this.orderApiAdapter.getOrderHistory(customerId);

    return history.map((item) => ({
      orderNumber: item.orderNumber,
      createdAt: new Intl.DateTimeFormat('ru-RU').format(new Date(item.createdAt)),
      status: item.status,
      total: new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(item.totalAmount),
    }));
  }
}
