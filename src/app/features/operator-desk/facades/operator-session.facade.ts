import { Injectable } from '@angular/core';
import { OperatorStatus } from '../components/call-panel/operator-status-switch/operator-status-switch';
import {NotificationService} from '../services/notification';
import {CallRoutingService} from '../services/call-routing';
import {BehaviorSubject, Observable} from 'rxjs';
import {OperatorSessionService} from '../services/operator-session';
import {OperatorSessionModel} from '../models/operator-session.model';
import {CallModel} from '../models/call.model';
import {CartModel} from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class OperatorSessionFacade {
  constructor(
    private readonly callRoutingService: CallRoutingService,
    private readonly notificationService: NotificationService,
    private readonly operatorSessionService: OperatorSessionService
  ) {}

  get session$(): Observable<OperatorSessionModel> {
    return this.operatorSessionService.session$;
  }

  get status$(): Observable<OperatorStatus> {
    return this.operatorSessionService.status$.asObservable();
  }

  get session(): OperatorSessionModel {
    return this.operatorSessionService.snapshot;
  }

  get status(): OperatorStatus {
    return this.operatorSessionService.statusSnapshot;
  }

  setStatus(status: OperatorStatus): OperatorStatus {
    const updated = this.callRoutingService.setOperatorStatus(status);
    this.notificationService.push({
      type: status === 'working' ? 'success' : 'info',
      title: 'Status changed',
      message: status === 'working' ? 'The operator is available.' : 'The operator is away.',
    });
    return this.operatorSessionService.setStatus(status).status;
  }

  toggleStatus(): OperatorStatus {
    return this.operatorSessionService.toggleStatus().status;
  }

  setActiveCall(call: CallModel | undefined): OperatorSessionModel {
    return this.operatorSessionService.setActiveCall(call);
  }

  setActiveCart(cart: CartModel | undefined): OperatorSessionModel {
    return this.operatorSessionService.setActiveCart(cart);
  }

  resetSession(): OperatorSessionModel {
    return this.operatorSessionService.clearSession();
  }
}
