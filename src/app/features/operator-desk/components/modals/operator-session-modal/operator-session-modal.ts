import {CommonModule, DatePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal} from '@angular/core';
import { OperatorSessionModel } from '../../../models/operator-session.model';
import {OperatorSessionFacade} from '../../../facades/operator-session.facade';
import {Subscription} from 'rxjs';
import {CallRoutingService} from '../../../services/call-routing';
import {CustomerModel} from '../../../models/customer.model';
import {ModalFacade} from '../../../facades/modal.facade';

@Component({
  selector: 'app-operator-session-modal',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './operator-session-modal.html',
  styleUrl: './operator-session-modal.scss',
})
export class OperatorSessionModal implements OnInit, OnDestroy{
  session = signal<OperatorSessionModel | null>(null);
  customer = signal<CustomerModel | null>(null);
  private subs: Subscription[] = [];

  constructor(private readonly callRoutingService: CallRoutingService,
    private readonly sessionFacade: OperatorSessionFacade,
              private readonly modalFacade: ModalFacade) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.modalFacade.close();
  }

  ngOnInit(): void {
    this.subs.push(this.sessionFacade.session$.subscribe(session => this.session.set(session)));
    this.subs.push(this.callRoutingService.activeCall$.subscribe(call => {
      this.customer.set(call?.customer || null);
    }));
  }
}
