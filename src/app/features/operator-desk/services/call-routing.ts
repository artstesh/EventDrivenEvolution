import {Injectable} from '@angular/core';
import {OperatorStatus} from '../components/call-panel/operator-status-switch/operator-status-switch';
import {CustomerModel} from '../models/customer.model';
import {CallModel} from '../models/call.model';
import {auditTime} from 'rxjs';
import {IPostboyDependingService} from '@artstesh/postboy';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {CartStateEvent} from '../messages/events/cart-state.event';
import {StartCallCommand} from '../messages/commands/start-call.command';
import {CallEvent} from '../messages/events/call.event';
import {CustomerApiAdapter} from '../adapters/api/customer-api.adapter';
import {EndCallCommand} from '../messages/commands/end-call.command';
import {CustomerFromDtoExecutor} from '../messages/executors/customer-from-dto.executor';

@Injectable({
  providedIn: 'root',
})
export class CallRoutingService implements IPostboyDependingService {
  private namespace = 'call-service';

  constructor(private postboy: AppPostboyService,
              private readonly customerAdapter: CustomerApiAdapter) {
    postboy.addNamespace(this.namespace)
      .recordReplay(CartStateEvent)
      .recordSubject(EndCallCommand)
      .recordSubject(StartCallCommand)
      .recordReplay(CallEvent);
  }

  up(): void {
    this.postboy.sub(StartCallCommand).subscribe((cmd) => this.startCall(cmd.customer));
    this.postboy.sub(EndCallCommand).subscribe(() => this.endCall());
    this.customerAdapter.customer$.pipe(auditTime(100)).subscribe((customer) =>
      this.startCall(this.postboy.exec(new CustomerFromDtoExecutor(customer))))
  }

  private operatorStatus: OperatorStatus = 'working';
  private activeCall: CallModel | null = null;

  private startCall(customer: CustomerModel): void {
    const call: CallModel = {
      id: `call-${Date.now()}`,
      customer,
      startedAt: new Date().toISOString(),
      status: 'active',
      durationSeconds: 0,
    };
    this.activeCall = call;
    this.postboy.fire(new CallEvent(call));
  }

  endCall(): void {
    if (!this.activeCall) {
      return;
    }
    this.activeCall = null;
    this.postboy.fire(new CallEvent(null));
    this.customerAdapter.getNextCustomer();
  }

  canReceiveIncomingCalls(): boolean {
    return this.operatorStatus === 'working';
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
