import {Injectable} from '@angular/core';
import {OrderService} from '../services/order';
import {CallRoutingService} from '../services/call-routing';
import {CustomerModel} from '../models/customer.model';
import {CartService} from '../services/cart';
import {CartModel} from '../models/cart.model';
import {DiscountReasonModel} from '../models/discount-reason.model';
import {OrderModel} from '../models/order.model';
import {OrderHistoryVm} from '../mappers/order.mapper';
import {NotificationFacade} from './notification.facade';
import {NotificationService} from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  private customer: CustomerModel | null = null;
  private cart: CartModel | null = null;

  constructor(private readonly orderService: OrderService,
              private readonly notificationService: NotificationService,
              private readonly routingService: CallRoutingService,
              private readonly cartModel: CartService
  ) {
    this.routingService.activeCall$.subscribe(call => {
      this.customer = call?.customer || null;
    });
    this.cartModel.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  async confirmOrder(discountReason?: DiscountReasonModel): Promise<OrderModel> {
    if (!this.customer || !this.cart) {
      this.notificationService.push({
        type: 'error',
        title: 'Error',
        message: `Customer or cart is not set.`,
      });
      return Promise.reject();
    }
    let orderModelPromise = await this.orderService.confirmOrder(this.customer, this.cart, discountReason);
    this.notificationService.push({
      type: 'success',
      title: 'Order confirmed',
      message: `Order ${orderModelPromise.id} is confirmed.`,
    });
    return orderModelPromise;
  }

  async getOrderHistory(): Promise<OrderHistoryVm[]> {
    if (!this.customer?.id){
      this.notificationService.push({
        type: 'error',
        title: 'Error',
        message: `Customer is not set.`,
      });
      return Promise.reject();}
    return this.orderService.getOrderHistory(this.customer.id);
  }
}
