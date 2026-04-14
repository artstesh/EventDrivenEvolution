import {PostboyGenericMessage} from '@artstesh/postboy';
import {NotificationItem} from '../../services/notification';

export class NotificationsEvent extends PostboyGenericMessage {
  static readonly ID = '48751b3f-858a-40cd-9b29-dffe7cc1a525';

  constructor(public notifications: NotificationItem[]) {
    super();
  }
}
