import { Injectable } from '@angular/core';
import { StockWebSocketAdapter, StockUpdateDto } from '../adapters/websocket/stock-websocket.adapter';
import {CustomerQueueWebsocketAdapter} from '../adapters/websocket/customer-queue-websocket.adapter';
import {NotificationService} from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class CustomerQueueFacade {
  private unsubscribeStock?: () => void;

  constructor(private readonly adapter: CustomerQueueWebsocketAdapter,
              private readonly notificationService: NotificationService) {}

  startStockFeed(onUpdate?: (event: number) => void): void {
    this.adapter.connect();

    if (onUpdate) {
      this.adapter.subscribe((event) => {
        onUpdate(event);

        this.notificationService.push({
          type: 'info',
          title: 'Customer queue is updated',
          message: `The customer queue is ${event} now.`,
        });
      });
    }
  }

  stop(): void {
    this.unsubscribeStock?.();
    this.unsubscribeStock = undefined;
    this.adapter.disconnect();
  }
}
