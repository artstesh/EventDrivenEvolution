import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal} from '@angular/core';
import {CallModel} from '../../../models/call.model';
import {CallRoutingService} from '../../../services/call-routing';
import {interval, Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';

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
  activeCall = signal<CallModel | null>(null);
  @Output() endCall = new EventEmitter<void>();
  callDuration = signal(0);
  callDurationSub?: Subscription;

  constructor(private readonly callRoutingService: CallRoutingService) {
  }

  ngOnInit(): void {
    this.callRoutingService.activeCall$.subscribe(call => {
      this.activeCall.set(call);
      this.callDurationSub?.unsubscribe();
      this.callDurationSub = interval(1000).subscribe(value => this.callDuration.set(value * 1000));
    });
  }

  ngOnDestroy(): void {
    this.callDurationSub?.unsubscribe();
  }

}
