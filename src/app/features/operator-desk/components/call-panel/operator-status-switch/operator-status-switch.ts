import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {OperatorSessionFacade} from '../../../facades/operator-session.facade';
import {Subscription} from 'rxjs';

export type OperatorStatus = 'working' | 'away';

@Component({
  selector: 'app-operator-status-switch',
  standalone: true,
  imports: [],
  templateUrl: './operator-status-switch.html',
  styleUrl: './operator-status-switch.scss',
})
export class OperatorStatusSwitch implements OnInit, OnDestroy {
  status = signal<OperatorStatus>('working');
  private subs: Subscription[] = [];

  constructor(private readonly sessionFacade: OperatorSessionFacade) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.sessionFacade.status$.subscribe(status => this.status.set(status)));
  }

  setStatus(status: OperatorStatus): void {
    this.sessionFacade.setStatus(status);
  }
}
