import {PostboyGenericMessage} from '@artstesh/postboy';
import {CartModel} from '../../models/cart.model';

export class CartStateEvent extends PostboyGenericMessage {
  static readonly ID = '0d5a78d9-d9c4-4cc9-84ca-2bd83e7f1abf';

  constructor(public cart: CartModel) {
    super();
  }
}
