import { Injectable } from '@angular/core';
import { CartMapper, CartWidgetVm } from '../mappers/cart.mapper';
import { CartModel } from '../models/cart.model';
import { CartItemModel } from '../models/cart-item.model';
import { MoneyModel } from '../models/money.model';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartModel = this.createEmptyCart();

  constructor(private readonly cartMapper: CartMapper) {}

  getCart(): CartModel {
    return this.cart;
  }

  getCartVm(): CartWidgetVm {
    return this.cartMapper.mapModelToWidgetVm(this.cart);
  }

  addItem(product: ProductModel, quantity = 1): CartModel {
    const existing = this.cart.items.find((item) => item.product.id === product.id);
    const unitPrice = product.price;

    if (existing) {
      existing.quantity += quantity;
      existing.totalPrice = this.multiplyMoney(unitPrice, existing.quantity);
    } else {
      const item: CartItemModel = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        unitPrice,
        totalPrice: this.multiplyMoney(unitPrice, quantity),
      };

      this.cart.items = [...this.cart.items, item];
    }

    this.recalculateTotals();
    return this.cart;
  }

  clearCart(): CartModel {
    this.cart = this.createEmptyCart();
    return this.cart;
  }

  setDiscount(discount: MoneyModel): CartModel {
    this.cart.discount = discount;
    this.recalculateTotals();
    return this.cart;
  }

  private recalculateTotals(): void {
    this.cart.subtotal = this.cartMapper.calculateSubtotal(this.cart.items);
    this.cart.total = this.cartMapper.calculateTotal(this.cart.subtotal, this.cart.discount);
  }

  private createEmptyCart(): CartModel {
    return {
      id: `cart-${Date.now()}`,
      items: [],
      discount: { amount: 0, currency: 'RUB' },
      subtotal: { amount: 0, currency: 'RUB' },
      total: { amount: 0, currency: 'RUB' },
    };
  }

  private multiplyMoney(money: MoneyModel, quantity: number): MoneyModel {
    return {
      amount: money.amount * quantity,
      currency: money.currency,
    };
  }
}
