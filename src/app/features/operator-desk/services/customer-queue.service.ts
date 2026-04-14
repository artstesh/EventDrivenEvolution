import {Injectable} from '@angular/core';
import {CustomerQueueWebsocketAdapter} from '../adapters/websocket/customer-queue-websocket.adapter';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';
import {IPostboyDependingService} from '@artstesh/postboy';
import {CustomerQueueEvent} from '../messages/events/customer-queue.event';

@Injectable({
  providedIn: 'root',
})
export class CustomerQueueService implements IPostboyDependingService {
  private namespace = 'call-service';

  constructor(private postboy: AppPostboyService,
              private readonly adapter: CustomerQueueWebsocketAdapter) {
    postboy.addNamespace(this.namespace)
      .recordReplay(CustomerQueueEvent);
  }


  up(): void {
    this.startStockFeed();
  }

  private startStockFeed(): void {
    this.adapter.connect();

    this.adapter.subscribe((event) => {
      this.postboy.fire(new CustomerQueueEvent(event));

      this.postboy.fire(new PushNotificationCommand({
        type: 'info',
        title: 'Customer queue is updated',
        message: `The customer queue is ${event} now.`,
      }));
    });
  }

  down = () => {
    this.adapter.disconnect();
    this.postboy.eliminateNamespace(this.namespace)
  };
}
