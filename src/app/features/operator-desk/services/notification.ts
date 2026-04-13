import { Injectable, signal } from '@angular/core';

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
export class NotificationService {
  private readonly notificationsSignal = signal<NotificationItem[]>([]);

  get notifications(): NotificationItem[] {
    return this.notificationsSignal();
  }

  push(notification: NotificationPayload): NotificationItem[] {
    const item: NotificationItem = {
      ...notification,
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };

    this.notificationsSignal.update((current) => [...current, item]);

    window.setTimeout(() => {
      this.remove(item.id);
    }, 4000);

    return this.notificationsSignal();
  }

  remove(id: string): void {
    this.notificationsSignal.update((current) => current.filter((item) => item.id !== id));
  }

  clear(): void {
    this.notificationsSignal.set([]);
  }
}
