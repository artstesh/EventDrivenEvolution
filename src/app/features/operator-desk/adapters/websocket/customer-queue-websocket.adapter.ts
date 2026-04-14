import {Injectable} from '@angular/core';

type CustomerQueueUpdateHandler = (event: number) => void;
@Injectable({
  providedIn: 'root',
})
export class CustomerQueueWebsocketAdapter {
  private handlers = new Set<CustomerQueueUpdateHandler>();
  private timerId: ReturnType<typeof setInterval> | null = null;

  connect(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      const queue = Math.floor(Math.random() * 10)+1;
      this.handlers.forEach((handler) => handler(queue));
    }, 11000);
  }

  disconnect(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  subscribe(handler: CustomerQueueUpdateHandler): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
