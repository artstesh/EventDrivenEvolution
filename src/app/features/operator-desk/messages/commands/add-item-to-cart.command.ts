import {PostboyGenericMessage} from '@artstesh/postboy';
import {ProductModel} from '../../models/product.model';

export class AddItemToCartCommand extends PostboyGenericMessage {
  static readonly ID = '27c6b95c-67c2-4e01-8b0a-104eb300b4b5';

  constructor(public product: ProductModel, public quantity: number = 1) {
    super();
  }
}
