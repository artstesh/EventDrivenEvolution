import {Injectable} from '@angular/core';
import {PostboyAbstractRegistrator} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {NotificationService} from './notification';
import {OperatorSessionService} from './operator-session';
import {ModalService} from './modal';
import {CatalogService} from './catalog';
import {CartService} from './cart';
import {OrderService} from './order';
import {CallRoutingService} from './call-routing';
import {CustomerQueueService} from './customer-queue.service';
import {
  CustomerFromDtoExecutor,
  CustomerFromDtoExecutorHandler
} from '../messages/executors/customer-from-dto.executor';
import {OrderMappingExecutor, OrderMappingExecutorHandler} from '../messages/executors/order-mapping.executor';
import {
  ProductCardToProductModelExecutor,
  ProductCardToProductModelExecutorHandler
} from '../messages/executors/product-card-to-product-model.executor';
import {
  ProductDtoToModelExecutor,
  ProductDtoToModelExecutorHandler
} from '../messages/executors/product-dto-to-model.executor';
import {
  ProductModelToVmExecutor,
  ProductModelToVmExecutorHandler
} from '../messages/executors/product-model-to-vm.executor';
import {
  CartModelToWidgetExecutor,
  CartModelToWidgetExecutorHandler
} from '../messages/executors/cart-model-to-widget.executor';

@Injectable()
export class OperatorDeskMessageRegister extends PostboyAbstractRegistrator {

  constructor(postboy: AppPostboyService,
              notif: NotificationService,
              operSession: OperatorSessionService,
              modal: ModalService,
              catalog: CatalogService,
              cart: CartService,
              order: OrderService,
              call: CallRoutingService,
              queue: CustomerQueueService) {
    super(postboy);
    this.registerServices([notif, operSession, modal, catalog, cart, order, call, queue]);
  }

  protected override _up(): void {
    this.recordHandler(CustomerFromDtoExecutor, new CustomerFromDtoExecutorHandler());
    this.recordHandler(OrderMappingExecutor, new OrderMappingExecutorHandler());
    this.recordHandler(ProductCardToProductModelExecutor, new ProductCardToProductModelExecutorHandler());
    this.recordHandler(ProductDtoToModelExecutor, new ProductDtoToModelExecutorHandler());
    this.recordHandler(ProductModelToVmExecutor, new ProductModelToVmExecutorHandler());
    this.recordHandler(CartModelToWidgetExecutor, new CartModelToWidgetExecutorHandler());
  }

}
