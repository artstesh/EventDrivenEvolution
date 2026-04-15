import {PostboyCallbackMessage} from '@artstesh/postboy';
import {OrderModel} from '../../models/order.model';

export class ConfirmOrderCommand extends PostboyCallbackMessage<OrderModel> {
  static readonly ID = 'c21c440e-1b2e-473a-8230-09b55dbff9b5';

  constructor() {
    super();
  }
}
