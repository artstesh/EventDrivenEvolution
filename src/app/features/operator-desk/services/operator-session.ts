import {Injectable} from '@angular/core';
import {CartModel} from '../models/cart.model';
import {OperatorSessionModel} from '../models/operator-session.model';
import {OperatorStatus} from '../components/call-panel/operator-status-switch/operator-status-switch';
import {IPostboyDependingService} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {OperatorSessionEvent} from '../messages/events/operator-session.event';
import {SetOperatorStatusCommand} from '../messages/commands/set-operator-status.command';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';

@Injectable({
  providedIn: 'root',
})
export class OperatorSessionService implements IPostboyDependingService {
  state: OperatorSessionModel;

  private namespace = 'operator-session-service';

  constructor(private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordReplay(OperatorSessionEvent)
      .recordSubject(SetOperatorStatusCommand);
    this.state = this.createInitialSession();
  }

  up(): void {
    this.postboy.fire(new OperatorSessionEvent(this.state));
    this.postboy.sub(SetOperatorStatusCommand).subscribe((cmd) =>
      cmd.model.status ? this.setStatus(cmd.model.status) : cmd.model.toggle ? this.toggleStatus() : false)
  }

  setStatus(status: OperatorStatus): void {
    this.state = {
      ...this.state,
      status,
      workingSince: status === 'working' ? this.state.workingSince ?? new Date().toISOString() : this.state.workingSince,
    };
    this.postboy.fire(new OperatorSessionEvent(this.state));
    this.postboy.fire(new PushNotificationCommand(status === 'working' ? 'success' : 'info', 'Status changed', status === 'working' ? 'The operator is available.' : 'The operator is away.'));
  }

  toggleStatus(): void {
    this.setStatus(this.state.status === 'working' ? 'away' : 'working');
  }

  private createInitialSession(): OperatorSessionModel {
    return {
      operatorId: 'op-001',
      operatorName: 'Operator',
      status: 'working',
      workingSince: new Date().toISOString(),
    };
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
