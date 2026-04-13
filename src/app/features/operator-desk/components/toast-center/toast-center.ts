import {Component} from '@angular/core';
import {NotificationFacade} from '../../facades/notification.facade';

@Component({
  selector: 'app-toast-center',
  standalone: true,
  imports: [],
  templateUrl: './toast-center.html',
  styleUrl: './toast-center.scss',
})
export class ToastCenter {
  constructor(private readonly notificationFacade: NotificationFacade) {}

  get notifications() {
    return this.notificationFacade.notifications;
  }

  dismiss(id: string): void {
    this.notificationFacade.remove(id);
  }
}
