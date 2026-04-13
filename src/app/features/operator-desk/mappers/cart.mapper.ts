import {Injectable} from '@angular/core';
import {CartModel} from '../models/cart.model';
import {CartItemModel} from '../models/cart-item.model';
import {ProductMapper} from './product.mapper';
import {Currency} from '../adapters/api/models/currency.enum';

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

  mapItem(productName: string, quantity: number, unitPrice: number, totalPrice: number, productId: string): CartItemModel {
    return {
      id: `${productId}-${Date.now()}`,
      product: {
        id: productId,
        sku: productId,
        name: productName,
        description: '',
        category: {
          id: 'unknown',
          name: 'Phones',
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

  calculateSubtotal(items: CartItemModel[]): number {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  calculateTotal(subtotal: number, discount: number): number {
    return  Math.max(0, subtotal - discount);
  }

  private getItemCount(items: CartItemModel[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private formatMoney(money: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(money);
  }
}
