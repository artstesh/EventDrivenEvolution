import {PostboyGenericMessage} from '@artstesh/postboy';
import {ModalType} from '../../models/modal.model';

export class ModalStateEvent extends PostboyGenericMessage {
  static readonly ID = '95df4c53-2ae7-47b7-8106-1f0ef6a8e8ca';

  constructor(public type: ModalType | null) {
    super();
  }
}
