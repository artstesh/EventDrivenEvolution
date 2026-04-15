import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {distinctUntilChanged, map, Subscription} from 'rxjs';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {OperatorSessionEvent} from '../../../messages/events/operator-session.event';
import {SetOperatorStatusCommand} from '../../../messages/commands/set-operator-status.command';

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

  constructor(private readonly postboy: AppPostboyService) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(OperatorSessionEvent).pipe(map(e => e.session.status), distinctUntilChanged()).subscribe(status => this.status.set(status)));
  }

  setStatus(status: OperatorStatus): void {
    this.postboy.fire(new SetOperatorStatusCommand({status}));
  }
}
