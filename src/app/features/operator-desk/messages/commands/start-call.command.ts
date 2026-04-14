import {PostboyGenericMessage} from '@artstesh/postboy';
import {CustomerModel} from '../../models/customer.model';

export class StartCallCommand extends PostboyGenericMessage {
  static readonly ID = '6ffc2b38-4b32-45db-87cc-1a461d7b1538';

  constructor(public customer: CustomerModel) {
    super();
  }
}
