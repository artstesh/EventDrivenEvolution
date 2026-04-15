import {Injectable} from '@angular/core';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {OpenModalCommand} from '../messages/commands/open-modal.command';
import {ModalStateEvent} from '../messages/events/modal-state.event';
import {IPostboyDependingService} from '@artstesh/postboy';
import {CloseModalsCommand} from '../messages/commands/close-modals.command';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements IPostboyDependingService {
  private namespace = 'modal-service';

  constructor(private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordReplay(ModalStateEvent)
      .recordSubject(CloseModalsCommand)
      .recordSubject(OpenModalCommand);
  }

  up(): void {
    this.postboy.sub(OpenModalCommand).subscribe((cmd) => this.open(cmd));
    this.postboy.sub(CloseModalsCommand).subscribe(() => this.postboy.fire(new ModalStateEvent(null)));
  }

  private open(cmd: OpenModalCommand) {
    this.postboy.fire(new ModalStateEvent(cmd.type));
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
