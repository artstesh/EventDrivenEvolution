import {PostboyGenericMessage} from '@artstesh/postboy';
import {NotificationPayload} from '../../services/notification';

export class PushNotificationCommand extends PostboyGenericMessage {
  static readonly ID = 'ce55479d-ccb8-494f-84d4-8ab30f7b7825';
  public notification: NotificationPayload;

  constructor(public type: 'success' | 'info' | 'warning' | 'error',
              public title: string,
              public message: string) {
    super();
    this.notification = {type, title, message};
  }
}
