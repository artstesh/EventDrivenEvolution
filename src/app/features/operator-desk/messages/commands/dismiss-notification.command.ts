import {PostboyGenericMessage} from '@artstesh/postboy';

export class DismissNotificationCommand extends PostboyGenericMessage {
  static readonly ID = '33c57d2f-8214-4af4-8cef-7090b350f500';

  constructor(public notificationId: string) {
    super();
  }
}
