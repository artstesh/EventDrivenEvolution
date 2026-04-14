import {PostboyGenericMessage} from '@artstesh/postboy';
import {CallModel} from '../../models/call.model';

export class CallEvent extends PostboyGenericMessage {
  static readonly ID = 'c98c4392-2803-4abc-ada9-34967b1e366b';

  constructor(public call: CallModel|null) {
    super();
  }
}
