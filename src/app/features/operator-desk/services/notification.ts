import { Injectable } from '@angular/core';

export interface NotificationPayload {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private queue: NotificationPayload[] = [];

  push(notification: NotificationPayload): NotificationPayload[] {
    this.queue = [...this.queue, notification];
    return this.queue;
  }

  getNotifications(): NotificationPayload[] {
    return this.queue;
  }

  clear(): void {
    this.queue = [];
  }
}
