import {Component, input, Input, OnDestroy, OnInit, signal} from '@angular/core';
import { OperatorStatus } from '../call-panel/operator-status-switch/operator-status-switch';
import {Subscription} from 'rxjs';
import {OperatorSessionFacade} from '../../facades/operator-session.facade';
import {ModalFacade} from '../../facades/modal.facade';
import {CustomerQueueFacade} from '../../facades/customer-queue.facade';
import {CatalogSearchResult, CatalogSearchViewResult, CatalogService} from '../../services/catalog';

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
  displayedCount = input.required<number>();

  constructor(private readonly sessionFacade: OperatorSessionFacade,
              private readonly modalFacade: ModalFacade,
              private readonly queueFacade: CustomerQueueFacade) {
  }

  ngOnInit(): void {
    this.subs.push(this.sessionFacade.status$.subscribe(status => this.status.set(status)));
    this.queueFacade.startStockFeed(n => this.queue.set(n));
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
