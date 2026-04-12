import { Injectable } from '@angular/core';
import { OperatorStatus } from '../components/call-panel/operator-status-switch/operator-status-switch';
import {NotificationService} from '../services/notification';
import {CallRoutingService} from '../services/call-routing';

@Injectable({
  providedIn: 'root',
})
export class OperatorSessionFacade {
  constructor(
    private readonly callRoutingService: CallRoutingService,
    private readonly notificationService: NotificationService,
  ) {}

  get status(): OperatorStatus {
    return this.callRoutingService.getOperatorStatus();
  }

  setStatus(status: OperatorStatus): OperatorStatus {
    const updated = this.callRoutingService.setOperatorStatus(status);

    this.notificationService.push({
      type: status === 'working' ? 'success' : 'info',
      title: 'Статус оператора обновлён',
      message: status === 'working' ? 'Оператор снова принимает звонки.' : 'Оператор временно недоступен.',
    });

    return updated;
  }

  canReceiveIncomingCalls(): boolean {
    return this.callRoutingService.canReceiveIncomingCalls();
  }
}
