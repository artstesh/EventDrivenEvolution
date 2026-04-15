import {AppPostboyService} from './app-postboy.service';
import {PostboyMessage, PostboyMiddleware} from '@artstesh/postboy';
import {CallEvent} from '../../features/operator-desk/messages/events/call.event';
import {PushNotificationCommand} from '../../features/operator-desk/messages/commands/push-notification.command';
import {EndCallCommand} from '../../features/operator-desk/messages/commands/end-call.command';
import {OpenModalCommand} from '../../features/operator-desk/messages/commands/open-modal.command';

export class PostboyNotificationMiddleware implements PostboyMiddleware {

  constructor(private postboy: AppPostboyService) {
  }

  handle(message: PostboyMessage): void {
    switch (message.id) {
      case CallEvent.ID: {
        const customer = (message as CallEvent).call?.customer;
        customer && this.postboy.fire(new PushNotificationCommand('info', customer ? 'Income call' : 'The call is ended', `Client ${customer.fullName} is on air.`));
        break;
      }
      case EndCallCommand.ID: {
        this.postboy.fire(new PushNotificationCommand('info', 'Session is over', 'Client data and shopping cart cleared.'));
        break;
      }
      case OpenModalCommand.ID: {
        this.postboy.fire(new PushNotificationCommand('info', 'A modal is opened', `The modal "${(message as OpenModalCommand).type}" is opened.`));
        break;
      }
    }
  }
}
