import {PostboyGenericMessage} from '@artstesh/postboy';
import {NotificationPayload} from '../../services/notification';

export class PushNotificationCommand extends PostboyGenericMessage {
  static readonly ID = 'ce55479d-ccb8-494f-84d4-8ab30f7b7825';

  constructor(public notification: NotificationPayload) {
    super();
  }
}
