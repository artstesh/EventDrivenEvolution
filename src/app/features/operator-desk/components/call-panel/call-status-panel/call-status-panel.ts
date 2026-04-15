import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {CallModel} from '../../../models/call.model';
import {interval, Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {CallEvent} from '../../../messages/events/call.event';
import {EndCallCommand} from '../../../messages/commands/end-call.command';

@Component({
  selector: 'app-call-status-panel',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './call-status-panel.html',
  styleUrl: './call-status-panel.scss',
})
export class CallStatusPanel implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  activeCall = signal<CallModel | null>(null);
  callDuration = signal(0);
  callDurationSub?: Subscription;

  constructor(private readonly postboy: AppPostboyService) {
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(CallEvent).subscribe(ev => {
      this.activeCall.set(ev.call || null);
      this.callDurationSub?.unsubscribe();
      this.callDurationSub = interval(1000).subscribe(value => this.callDuration.set(value * 1000));
    }));
  }

  finishCall(): void {
    this.postboy.fire(new EndCallCommand());
  }

  ngOnDestroy(): void {
    this.callDurationSub?.unsubscribe();
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
