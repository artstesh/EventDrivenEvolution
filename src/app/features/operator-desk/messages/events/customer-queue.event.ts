import {PostboyGenericMessage} from '@artstesh/postboy';

export class CustomerQueueEvent extends PostboyGenericMessage {
  static readonly ID = '9b81866f-3671-471f-bdc5-198921a5d20e';

  constructor(public count: number) {
    super();
  }
}
