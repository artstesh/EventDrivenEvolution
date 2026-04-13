import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartModel } from '../models/cart.model';
import { CallModel } from '../models/call.model';
import { OperatorSessionModel } from '../models/operator-session.model';
import { OperatorStatus } from '../components/call-panel/operator-status-switch/operator-status-switch';

@Injectable({
  providedIn: 'root',
})
export class OperatorSessionService {
  private readonly sessionSubject = new BehaviorSubject<OperatorSessionModel>(this.createInitialSession());

  readonly session$ = this.sessionSubject.asObservable();
  readonly status$ = new BehaviorSubject<OperatorStatus>(this.sessionSubject.value.status);

  get snapshot(): OperatorSessionModel {
    return this.sessionSubject.value;
  }

  get statusSnapshot(): OperatorStatus {
    return this.status$.value;
  }

  setStatus(status: OperatorStatus): OperatorSessionModel {
    const updated = {
      ...this.snapshot,
      status,
      workingSince: status === 'working' ? this.snapshot.workingSince ?? new Date().toISOString() : this.snapshot.workingSince,
    };

    this.sessionSubject.next(updated);
    this.status$.next(status);

    return updated;
  }

  toggleStatus(): OperatorSessionModel {
    return this.setStatus(this.statusSnapshot === 'working' ? 'away' : 'working');
  }

  setActiveCall(call: CallModel | undefined): OperatorSessionModel {
    const updated = {
      ...this.snapshot,
      activeCall: call,
    };

    this.sessionSubject.next(updated);
    return updated;
  }

  setActiveCart(cart: CartModel | undefined): OperatorSessionModel {
    const updated = {
      ...this.snapshot,
      activeCart: cart,
    };

    this.sessionSubject.next(updated);
    return updated;
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
}
