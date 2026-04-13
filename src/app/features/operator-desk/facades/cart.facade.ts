import {Injectable} from '@angular/core';
import {CartService} from '../services/cart';
import {NotificationService} from '../services/notification';
import {ProductModel} from '../models/product.model';
import {CartModel} from '../models/cart.model';
import {CartWidgetVm} from '../mappers/cart.mapper';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  constructor(
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService,
  ) {}

  get cart(): ReplaySubject<CartModel> {
    return this.cartService.cart$;
  }

  addItem(product: ProductModel, quantity = 1): CartModel {
    const cart = this.cartService.addItem(product, quantity);

    this.notificationService.push({
      type: 'success',
      title: 'The item is added',
      message: `${product.name} id added to the cart.`,
    });

    return cart;
  }

  clearCart(): CartModel {
    const cart = this.cartService.clearCart();

    this.notificationService.push({
      type: 'info',
      title: 'The cart is cleaned',
      message: 'The cart is cleaned.',
    });

    return cart;
  }

  setDiscount(amount: number): CartModel {
    return this.cartService.setDiscount(amount);
  }
}
