import {Component, OnInit, signal} from '@angular/core';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {NotificationsEvent} from '../../messages/events/notifications.event';
import {NotificationItem} from '../../services/notification';
import {DismissNotificationCommand} from '../../messages/commands/dismiss-notification.command';

@Component({
  selector: 'app-toast-center',
  standalone: true,
  imports: [],
  templateUrl: './toast-center.html',
  styleUrl: './toast-center.scss',
})
export class ToastCenter implements OnInit{
  notifications = signal<NotificationItem[]>([]);

  constructor(private readonly postboy: AppPostboyService) {}

  ngOnInit(): void {
    this.postboy.sub(NotificationsEvent).subscribe(ev => this.notifications.set(ev.notifications))
    }

  dismiss(id: string): void {
    this.postboy.fire(new DismissNotificationCommand(id));
  }
}
