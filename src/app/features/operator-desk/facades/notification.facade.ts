import { Injectable } from '@angular/core';
import { NotificationItem, NotificationPayload, NotificationService } from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationFacade {
  constructor(private readonly notificationService: NotificationService) {}

  get notifications(): NotificationItem[] {
    return this.notificationService.notifications;
  }

  push(notification: NotificationPayload): NotificationItem[] {
    return this.notificationService.push(notification);
  }

  remove(id: string): void {
    this.notificationService.remove(id);
  }

  clear(): void {
    this.notificationService.clear();
  }
}
