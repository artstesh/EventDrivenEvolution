import {Injectable} from '@angular/core';
import {
  OrderApiAdapter,
  OrderConfirmationRequestDto,
  OrderConfirmationResponseDto
} from '../adapters/api/order-api.adapter';
import {CartModel} from '../models/cart.model';
import {CustomerModel} from '../models/customer.model';
import {DiscountReasonModel} from '../models/discount-reason.model';
import {OrderModel} from '../models/order.model';
import {IPostboyDependingService} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {CartStateEvent} from '../messages/events/cart-state.event';
import {ConfirmOrderCommand} from '../messages/commands/confirm-order.command';
import {ListOrderHistoryQuery} from '../messages/queries/list-order-history.query';
import {combineLatest} from 'rxjs';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';
import {CallEvent} from '../messages/events/call.event';
import {OrderHistoryVm} from '../models/order-history-vm';
import {OrderMappingExecutor} from '../messages/executors/order-mapping.executor';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements IPostboyDependingService {
  private namespace = 'order-service';

  constructor(private readonly orderApiAdapter: OrderApiAdapter,
              private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordSubject(ConfirmOrderCommand)
      .recordSubject(ListOrderHistoryQuery);
  }

  up(): void {
    combineLatest({
     order: this.postboy.sub(ConfirmOrderCommand),
      customer: this.postboy.sub(CallEvent),
      cart: this.postboy.sub(CartStateEvent)
    }).subscribe(async (cmd) => cmd.order.finish(await this.confirmOrder(cmd.customer.call?.customer||null, cmd.cart.cart)));

    combineLatest({
      qry: this.postboy.sub(ListOrderHistoryQuery),
      customer: this.postboy.sub(CallEvent)
    })
      .subscribe(async ev => ev.qry.finish(await this.getOrderHistory(ev.customer.call?.customer?.id || '')));
  }

  private async confirmOrder(customer: CustomerModel|null, cart: CartModel, discountReason?: DiscountReasonModel): Promise<OrderModel> {
    if (!customer){
      this.postboy.fire(new PushNotificationCommand({
        type: 'error',
        title: 'Error',
        message: `Customer is not set.`,
      }));
      return Promise.reject();}
    const request: OrderConfirmationRequestDto = {
      customerId: customer.id,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPriceAmount: item.unitPrice
      })),
      discountReason: discountReason?.text,
    };

    const response: OrderConfirmationResponseDto = await this.orderApiAdapter.confirmOrder(request);
    this.postboy.fire(new PushNotificationCommand({
      type: 'success',
      title: 'Order confirmed',
      message: `Order ${response.orderId} is confirmed.`,
    }));
    return this.postboy.exec(new OrderMappingExecutor(response, customer, cart, discountReason));
  }

  private async getOrderHistory(customerId: string): Promise<OrderHistoryVm[]> {
    if (!customerId){
      this.postboy.fire(new PushNotificationCommand({
        type: 'error',
        title: 'Error',
        message: `Customer is not set.`,
      }));
      return Promise.resolve([]);}
    const history = await this.orderApiAdapter.getOrderHistory(customerId);

    return history.map((item) => ({
      orderNumber: item.orderNumber,
      createdAt: new Date(item.createdAt),
      status: item.status,
      total: item.totalAmount,
    }));
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
