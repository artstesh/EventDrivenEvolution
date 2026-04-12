import { Injectable } from '@angular/core';
import { CartModel } from '../models/cart.model';
import { CartItemModel } from '../models/cart-item.model';
import { MoneyModel } from '../models/money.model';
import { ProductMapper } from './product.mapper';

export interface CartWidgetVm {
  itemCount: number;
  discount: string;
  subtotal: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class CartMapper {
  constructor(private readonly productMapper: ProductMapper) {}

  mapModelToWidgetVm(model: CartModel): CartWidgetVm {
    return {
      itemCount: this.getItemCount(model.items),
      discount: this.formatMoney(model.discount),
      subtotal: this.formatMoney(model.subtotal),
      total: this.formatMoney(model.total),
      items: model.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: this.formatMoney(item.unitPrice),
        totalPrice: this.formatMoney(item.totalPrice),
      })),
    };
  }

  mapItem(productName: string, quantity: number, unitPrice: MoneyModel, totalPrice: MoneyModel, productId: string): CartItemModel {
    return {
      id: `${productId}-${Date.now()}`,
      product: {
        id: productId,
        sku: productId,
        name: productName,
        description: '',
        category: {
          id: 'unknown',
          name: 'Без категории',
          code: 'unknown',
        },
        price: unitPrice,
        stockStatus: 'available',
        warehouse: '',
      },
      quantity,
      unitPrice,
      totalPrice,
    };
  }

  calculateSubtotal(items: CartItemModel[]): MoneyModel {
    const currency = items[0]?.unitPrice.currency ?? 'RUB';
    const amount = items.reduce((sum, item) => sum + item.totalPrice.amount, 0);

    return { amount, currency };
  }

  calculateTotal(subtotal: MoneyModel, discount: MoneyModel): MoneyModel {
    return {
      amount: Math.max(0, subtotal.amount - discount.amount),
      currency: subtotal.currency,
    };
  }

  private getItemCount(items: CartItemModel[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private formatMoney(money: MoneyModel): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(money.amount);
  }
}
