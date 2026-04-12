import { Injectable } from '@angular/core';
import { NotificationPayload, NotificationService } from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationFacade {
  constructor(private readonly notificationService: NotificationService) {}

  get notifications(): NotificationPayload[] {
    return this.notificationService.getNotifications();
  }

  push(notification: NotificationPayload): NotificationPayload[] {
    return this.notificationService.push(notification);
  }

  clear(): void {
    this.notificationService.clear();
  }
}
