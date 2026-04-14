import {PostboyCallbackMessage} from '@artstesh/postboy';
import {OrderHistoryVm} from '../../models/order-history-vm';

export class ListOrderHistoryQuery extends PostboyCallbackMessage<OrderHistoryVm[]> {
  static readonly ID = 'a4c291d6-ab9b-4616-a351-87d378c88d41';

  constructor() {
    super();
  }
}
