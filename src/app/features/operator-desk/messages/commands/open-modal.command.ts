import {PostboyGenericMessage} from '@artstesh/postboy';
import {ModalType} from '../../models/modal.model';

export class OpenModalCommand extends PostboyGenericMessage {
  static readonly ID = '2b643d1a-cf73-490a-a59a-beec6a69863c';

  constructor(public type: ModalType) {
    super();
  }
}
