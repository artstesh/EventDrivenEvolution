import {DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {OperatorSessionModel} from '../../../models/operator-session.model';
import {Subscription} from 'rxjs';
import {CallRoutingService} from '../../../services/call-routing';
import {CustomerModel} from '../../../models/customer.model';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {OperatorSessionEvent} from '../../../messages/events/operator-session.event';
import {CloseModalsCommand} from '../../../messages/commands/close-modals.command';
import {CallEvent} from '../../../messages/events/call.event';

@Component({
  selector: 'app-operator-session-modal',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './operator-session-modal.html',
  styleUrl: './operator-session-modal.scss',
})
export class OperatorSessionModal implements OnInit, OnDestroy {
  session = signal<OperatorSessionModel | null>(null);
  customer = signal<CustomerModel | null>(null);
  private subs: Subscription[] = [];

  constructor(private readonly callRoutingService: CallRoutingService,
              private readonly postboy: AppPostboyService) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.postboy.fire(new CloseModalsCommand());
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(OperatorSessionEvent).subscribe(ev => this.session.set(ev.session)));
    this.subs.push(this.postboy.sub(CallEvent).subscribe(ev => this.customer.set(ev.call?.customer || null)));
  }
}
