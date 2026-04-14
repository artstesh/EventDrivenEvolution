import {Injectable} from '@angular/core';
import {CartModel} from '../models/cart.model';
import {CartItemModel} from '../models/cart-item.model';
import {ProductModel} from '../models/product.model';
import {IPostboyDependingService} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {CartStateEvent} from '../messages/events/cart-state.event';
import {AddItemToCartCommand} from '../messages/commands/add-item-to-cart.command';
import {ClearCartCommand} from '../messages/commands/clear-cart.command';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';

@Injectable({
  providedIn: 'root',
})
export class CartService implements IPostboyDependingService {
  private namespace = 'cart-service';
  private cart: CartModel = this.createEmptyCart();

  constructor(private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordReplay(CartStateEvent)
      .recordSubject(AddItemToCartCommand)
      .recordSubject(ClearCartCommand);
  }

  up(): void {
    this.postboy.sub(AddItemToCartCommand).subscribe((cmd) => this.addItem(cmd.product, cmd.quantity));
    this.postboy.sub(ClearCartCommand).subscribe(() => this.clearCart());
  }

  private addItem(product: ProductModel, quantity = 1): void {
    const existing = this.cart.items.find((item) => item.product.id === product.id);
    const unitPrice = product.price;

    if (existing) {
      existing.quantity += quantity;
      existing.totalPrice = this.multiplyMoney(unitPrice, existing.quantity);
      this.cart.recalculate();
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

    this.postboy.fire(new PushNotificationCommand({
      type: 'success',
      title: 'The item is added',
      message: `${product.name} id added to the cart.`,
    }));
    this.postboy.fire(new CartStateEvent(this.cart));
  }

  private clearCart(): void {
    this.cart = this.createEmptyCart();
    this.postboy.fire(new CartStateEvent(this.cart));
    this.postboy.fire(new PushNotificationCommand({
      type: 'info',
      title: 'The cart is cleaned',
      message: 'The cart is cleaned.',
    }));
  }

  private setDiscount(discount: number): void {
    this.cart.discount = discount;
    this.postboy.fire(new CartStateEvent(this.cart));
  }

  private createEmptyCart(): CartModel {
    return new CartModel(`cart-${Date.now()}`);
  }

  private multiplyMoney(money: number, quantity: number): number {
    return money * quantity;
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
