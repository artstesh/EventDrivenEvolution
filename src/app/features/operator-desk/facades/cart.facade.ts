import { Injectable } from '@angular/core';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification';
import { ProductModel } from '../models/product.model';
import { CartModel } from '../models/cart.model';
import { CartWidgetVm } from '../mappers/cart.mapper';

@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  constructor(
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService,
  ) {}

  get cart(): CartModel {
    return this.cartService.getCart();
  }

  get cartVm(): CartWidgetVm {
    return this.cartService.getCartVm();
  }

  addItem(product: ProductModel, quantity = 1): CartModel {
    const cart = this.cartService.addItem(product, quantity);

    this.notificationService.push({
      type: 'success',
      title: 'Товар добавлен',
      message: `${product.name} добавлен в корзину.`,
    });

    return cart;
  }

  clearCart(): CartModel {
    const cart = this.cartService.clearCart();

    this.notificationService.push({
      type: 'info',
      title: 'Корзина очищена',
      message: 'Все позиции были удалены.',
    });

    return cart;
  }

  setDiscount(amount: number): CartModel {
    const cart = this.cartService.setDiscount({
      amount,
      currency: 'RUB',
    });

    return cart;
  }
}
