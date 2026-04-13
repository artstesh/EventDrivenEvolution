import { Injectable } from '@angular/core';
import { OperatorStatus } from '../components/call-panel/operator-status-switch/operator-status-switch';
import { CustomerModel } from '../models/customer.model';
import { CallModel, CallStatusModel } from '../models/call.model';
import {BehaviorSubject, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CallRoutingService {
  private operatorStatus: OperatorStatus = 'working';
  private activeCall: CallModel | null = null;
  public activeCall$= new ReplaySubject<CallModel | null>(1);

  setOperatorStatus(status: OperatorStatus): OperatorStatus {
    this.operatorStatus = status;

    if (status === 'away') {
      this.activeCall = null;
    }

    return this.operatorStatus;
  }

  getOperatorStatus(): OperatorStatus {
    return this.operatorStatus;
  }

  startCall(customer: CustomerModel): void {
    const call: CallModel = {
      id: `call-${Date.now()}`,
      customer,
      startedAt: new Date().toISOString(),
      status: 'active',
      durationSeconds: 0,
    };

    this.activeCall = call;
    this.activeCall$.next(call);
  }

  endCall(): void {
    if (!this.activeCall) {
      return;
    }

    this.activeCall = {
      ...this.activeCall,
      status: 'ended' as CallStatusModel,
    };

    this.activeCall = null;
    this.activeCall$.next(null);
  }

  canReceiveIncomingCalls(): boolean {
    return this.operatorStatus === 'working';
  }
}
