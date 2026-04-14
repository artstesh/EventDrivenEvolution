import {Injectable} from '@angular/core';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {OpenModalCommand} from '../messages/commands/open-modal.command';
import {ModalStateEvent} from '../messages/events/modal-state.event';
import {IPostboyDependingService} from '@artstesh/postboy';
import {CloseModalsCommand} from '../messages/commands/close-modals.command';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements IPostboyDependingService{
  private namespace = 'modal-service';

  constructor(private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordReplay(ModalStateEvent)
      .recordSubject(CloseModalsCommand)
      .recordSubject(OpenModalCommand);
  }

  up(): void {
    this.postboy.sub(OpenModalCommand).subscribe((cmd) => this.open(cmd));
    this.postboy.sub(CloseModalsCommand).subscribe((cmd) => this.postboy.fire(new ModalStateEvent(null)));
  }

  private open(cmd: OpenModalCommand) {
    this.postboy.fire(new ModalStateEvent(cmd.type));
    this.postboy.fire(new PushNotificationCommand({
      type: 'info',
      title: 'A modal is opened',
      message: `The modal "${cmd.type}" is opened.`,
    }));
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
