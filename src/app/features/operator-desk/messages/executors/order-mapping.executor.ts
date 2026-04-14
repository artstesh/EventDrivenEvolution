import {OrderModel} from '../../models/order.model';
import {PostboyExecutionHandler, PostboyExecutor} from '@artstesh/postboy';
import {OrderConfirmationResponseDto} from '../../adapters/api/order-api.adapter';
import {CustomerModel} from '../../models/customer.model';
import {CartModel} from '../../models/cart.model';
import {DiscountReasonModel} from '../../models/discount-reason.model';

export class OrderMappingExecutor extends PostboyExecutor<OrderModel> {
  static readonly ID = 'a7465df7-8631-4893-8096-09424b50553c';

  constructor(public dto: OrderConfirmationResponseDto,
              public customer: CustomerModel,
              public cart: CartModel,
              public discountReason?: DiscountReasonModel) {
    super();
  }
}

export class OrderMappingExecutorHandler extends PostboyExecutionHandler<OrderModel, OrderMappingExecutor> {

  handle(executor: OrderMappingExecutor): OrderModel {
    return {
      id: executor.dto.orderId,
      customer: executor.customer,
      items: executor.cart.items,
      subtotal: executor.cart.subtotal,
      discount: executor.cart.discount,
      total: executor.dto.totalAmount,
      status: 'confirmed',
      discountReason: executor.discountReason,
      createdAt:executor. dto.confirmedAt,
      confirmedAt: executor.dto.confirmedAt,
    };
  }
}
