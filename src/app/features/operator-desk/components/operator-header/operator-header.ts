import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {OperatorStatus} from '../call-panel/operator-status-switch/operator-status-switch';
import {distinctUntilChanged, map, Subscription} from 'rxjs';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {OperationSessionEvent} from '../../messages/events/operation-session.event';
import {SetOperationStatusCommand} from '../../messages/commands/set-operation-status.command';
import {OpenModalCommand} from '../../messages/commands/open-modal.command';
import {CustomerQueueEvent} from '../../messages/events/customer-queue.event';

@Component({
  selector: 'app-operator-header',
  standalone: true,
  imports: [],
  templateUrl: './operator-header.html',
  styleUrl: './operator-header.scss',
})
export class OperatorHeader implements OnInit, OnDestroy {
  status = signal<OperatorStatus>('working');
  private subs: Subscription[] = [];
  queue = signal<number>(0);

  constructor(private readonly postboy: AppPostboyService) {
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(OperationSessionEvent).pipe(map(e => e.session.status), distinctUntilChanged()).subscribe(status => this.status.set(status)));
    this.postboy.sub(CustomerQueueEvent).subscribe(ev => this.queue.set(ev.count));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  toggleStatus(): void {
    this.postboy.fire(new SetOperationStatusCommand({toggle: true}));
  }

  openHistory(): void {
    this.postboy.fire(new OpenModalCommand('operator-session'));
  }
}
