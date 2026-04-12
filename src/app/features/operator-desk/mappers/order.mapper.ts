import { Injectable } from '@angular/core';
import { OrderConfirmationResponseDto } from '../adapters/api/order-api.adapter';
import { CartModel } from '../models/cart.model';
import { CustomerModel } from '../models/customer.model';
import { DiscountReasonModel } from '../models/discount-reason.model';
import { MoneyModel } from '../models/money.model';
import { OrderModel } from '../models/order.model';

export interface OrderHistoryVm {
  orderNumber: string;
  createdAt: string;
  status: string;
  total: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderMapper {
  mapConfirmationResponseToModel(
    dto: OrderConfirmationResponseDto,
    customer: CustomerModel,
    cart: CartModel,
    discountReason?: DiscountReasonModel,
  ): OrderModel {
    return {
      id: dto.orderId,
      customer,
      items: cart.items,
      subtotal: cart.subtotal,
      discount: cart.discount,
      total: this.mapMoney(dto.totalAmount, dto.totalCurrency),
      status: 'confirmed',
      discountReason,
      createdAt: dto.confirmedAt,
      confirmedAt: dto.confirmedAt,
    };
  }

  mapModelToHistoryVm(model: OrderModel): OrderHistoryVm {
    return {
      orderNumber: model.id,
      createdAt: this.formatDate(model.createdAt),
      status: model.status,
      total: this.formatMoney(model.total),
    };
  }

  mapMoney(amount: number, currency: MoneyModel['currency']): MoneyModel {
    return {
      amount,
      currency,
    };
  }

  private formatMoney(money: MoneyModel): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(money.amount);
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  }
}
