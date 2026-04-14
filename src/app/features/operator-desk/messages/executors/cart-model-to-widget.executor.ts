import {CartModel} from '../../models/cart.model';
import {PostboyExecutionHandler, PostboyExecutor} from '@artstesh/postboy';
import {CartWidgetVm} from '../../models/cart-widget';

export class CartModelToWidgetExecutor extends PostboyExecutor<CartWidgetVm> {
  static readonly ID = '55abdd1c-3437-4d11-aae3-4d3a62521331';

  constructor(public cart: CartModel) {
    super();
  }
}

export class CartModelToWidgetExecutorHandler extends PostboyExecutionHandler<CartWidgetVm, CartModelToWidgetExecutor> {

  handle(executor: CartModelToWidgetExecutor): CartWidgetVm {
    return {
      itemCount: executor.cart.count,
      discount: executor.cart.discount,
      subtotal: executor.cart.subtotal,
      total: executor.cart.total,
      items: executor.cart.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    };
  }
}
