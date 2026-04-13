import {Injectable} from '@angular/core';
import {CartMapper, CartWidgetVm} from '../mappers/cart.mapper';
import {CartModel} from '../models/cart.model';
import {CartItemModel} from '../models/cart-item.model';
import {ProductModel} from '../models/product.model';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartModel = this.createEmptyCart();
  public cart$ = new ReplaySubject<CartModel>(1);

  constructor(private readonly cartMapper: CartMapper) {
  }

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
    this.cart$.next(this.cart);
    return this.cart;
  }

  clearCart(): CartModel {
    this.cart = this.createEmptyCart();
    this.cart$.next(this.cart);
    return this.cart;
  }

  setDiscount(discount: number): CartModel {
    this.cart.discount = discount;
    this.recalculateTotals();
    return this.cart;
  }

  private recalculateTotals(): void {
    this.cart.subtotal = this.cartMapper.calculateSubtotal(this.cart.items);
    this.cart.total = this.cartMapper.calculateTotal(this.cart.subtotal, this.cart.discount);
    this.cart$.next(this.cart);
  }

  private createEmptyCart(): CartModel {
    return {
      id: `cart-${Date.now()}`,
      items: [],
      discount: 0,
      subtotal: 0,
      total: 0
    };
  }

  private multiplyMoney(money: number, quantity: number): number {
    return money * quantity;
  }
}
