import { Injectable } from '@angular/core';
import { OperatorStatus } from '../components/call-panel/operator-status-switch/operator-status-switch';
import { CustomerModel } from '../models/customer.model';
import { CallModel, CallStatusModel } from '../models/call.model';

@Injectable({
  providedIn: 'root',
})
export class CallRoutingService {
  private operatorStatus: OperatorStatus = 'working';
  private activeCall: CallModel | null = null;

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

  getActiveCall(): CallModel | null {
    return this.activeCall;
  }

  startCall(customer: CustomerModel): CallModel {
    const call: CallModel = {
      id: `call-${Date.now()}`,
      customer,
      startedAt: new Date().toISOString(),
      status: 'active',
      durationSeconds: 0,
    };

    this.activeCall = call;
    return call;
  }

  endCall(): CallModel | null {
    if (!this.activeCall) {
      return null;
    }

    this.activeCall = {
      ...this.activeCall,
      status: 'ended' as CallStatusModel,
    };

    const endedCall = this.activeCall;
    this.activeCall = null;
    return endedCall;
  }

  canReceiveIncomingCalls(): boolean {
    return this.operatorStatus === 'working';
  }
}
