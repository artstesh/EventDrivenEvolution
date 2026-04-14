import {Injectable, signal} from '@angular/core';
import {IPostboyDependingService} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';
import {NotificationsEvent} from '../messages/events/notifications.event';
import {DismissNotificationCommand} from '../messages/commands/dismiss-notification.command';

export interface NotificationPayload {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface NotificationItem extends NotificationPayload {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements IPostboyDependingService {
  private namespace = 'notification-service';

  constructor(private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordReplay(NotificationsEvent)
      .recordSubject(DismissNotificationCommand)
      .recordSubject(PushNotificationCommand);
  }

  up(): void {
    this.postboy.sub(PushNotificationCommand).subscribe((cmd) => this.push(cmd.notification));
    this.postboy.sub(DismissNotificationCommand).subscribe((cmd) => this.remove(cmd.notificationId));
  }

  private notificationsSignal: NotificationItem[] = [];

  push(notification: NotificationPayload): void {
    const item: NotificationItem = {
      ...notification,
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    this.notificationsSignal.push(item);
    this.postboy.fire(new NotificationsEvent(this.notificationsSignal))
    window.setTimeout(() => this.remove(item.id), 4000);
  }

  remove(id: string): void {
    this.notificationsSignal = this.notificationsSignal.filter((item) => item.id !== id);
    this.postboy.fire(new NotificationsEvent(this.notificationsSignal))
  }

  clear(): void {
    this.notificationsSignal = [];
    this.postboy.fire(new NotificationsEvent(this.notificationsSignal))
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
