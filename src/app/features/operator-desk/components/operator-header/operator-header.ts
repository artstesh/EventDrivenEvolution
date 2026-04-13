import {Component, Input, OnDestroy, OnInit, signal} from '@angular/core';
import { OperatorStatus } from '../call-panel/operator-status-switch/operator-status-switch';
import {Subscription} from 'rxjs';
import {OperatorSessionFacade} from '../../facades/operator-session.facade';
import {ModalFacade} from '../../facades/modal.facade';

@Component({
  selector: 'app-operator-header',
  standalone: true,
  imports: [],
  templateUrl: './operator-header.html',
  styleUrl: './operator-header.scss',
})
export class OperatorHeader implements OnInit, OnDestroy {
  @Input() queueSize = 0;
  @Input() shiftLabel = '08:00–20:00';
  status = signal<OperatorStatus>('working');
  private subs: Subscription[] = [];

  constructor(private readonly sessionFacade: OperatorSessionFacade,
              private readonly modalFacade: ModalFacade) {
  }

  ngOnInit(): void {
    this.subs.push(this.sessionFacade.status$.subscribe(status => this.status.set(status)));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  toggleStatus(): void {
    this.sessionFacade.toggleStatus();
  }

  openHistory(): void {
    this.modalFacade.open('operator-session');
  }
}
