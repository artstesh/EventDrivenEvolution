import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CartModel} from '../models/cart.model';
import {CallModel} from '../models/call.model';
import {OperatorSessionModel} from '../models/operator-session.model';
import {OperatorStatus} from '../components/call-panel/operator-status-switch/operator-status-switch';
import {IPostboyDependingService} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {OperationSessionEvent} from '../messages/events/operation-session.event';
import {SetOperationStatusCommand} from '../messages/commands/set-operation-status.command';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';

@Injectable({
  providedIn: 'root',
})
export class OperatorSessionService implements IPostboyDependingService {
  private readonly sessionSubject = new BehaviorSubject<OperatorSessionModel>(this.createInitialSession());
  state: OperatorSessionModel;
  readonly session$ = this.sessionSubject.asObservable();
  readonly status$ = new BehaviorSubject<OperatorStatus>(this.sessionSubject.value.status);

  private namespace = 'operator-session-service';

  constructor(private postboy: AppPostboyService) {
    postboy.addNamespace(this.namespace)
      .recordReplay(OperationSessionEvent)
      .recordSubject(SetOperationStatusCommand);
    this.state = this.createInitialSession();
  }

  up(): void {
    this.postboy.fire(new OperationSessionEvent(this.state));
    this.postboy.sub(SetOperationStatusCommand).subscribe((cmd) =>
      cmd.model.status ? this.setStatus(cmd.model.status) : cmd.model.toggle ? this.toggleStatus() : false)
  }

  setStatus(status: OperatorStatus): void {
    this.state = {
      ...this.state,
      status,
      workingSince: status === 'working' ? this.state.workingSince ?? new Date().toISOString() : this.state.workingSince,
    };
    this.postboy.fire(new OperationSessionEvent(this.state));
    this.postboy.fire(new PushNotificationCommand({
      type: status === 'working' ? 'success' : 'info',
      title: 'Status changed',
      message: status === 'working' ? 'The operator is available.' : 'The operator is away.',
    }));
  }

  toggleStatus(): void {
    this.setStatus(this.state.status === 'working' ? 'away' : 'working');
  }

  setActiveCart(cart: CartModel | undefined): void {
    this.state = {
      ...this.state,
      activeCart: cart,
    };
    this.postboy.fire(new OperationSessionEvent(this.state));
  }

  clearSession(): OperatorSessionModel {
    const cleared = this.createInitialSession();
    this.sessionSubject.next(cleared);
    this.status$.next(cleared.status);
    return cleared;
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
