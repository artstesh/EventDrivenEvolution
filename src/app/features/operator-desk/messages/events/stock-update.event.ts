import {PostboyGenericMessage} from '@artstesh/postboy';
import {StockUpdateDto} from '../../adapters/websocket/stock-websocket.adapter';

export class StockUpdateEvent extends PostboyGenericMessage {
  static readonly ID = 'c774ba76-169f-4d09-bd5c-578dd98e5dab';

  constructor(public dto: StockUpdateDto) {
    super();
  }
}
