import { Component, EventEmitter, Input, Output } from '@angular/core';

export type OperatorStatus = 'working' | 'away';

@Component({
  selector: 'app-operator-status-switch',
  standalone: true,
  imports: [],
  templateUrl: './operator-status-switch.html',
  styleUrl: './operator-status-switch.scss',
})
export class OperatorStatusSwitch {
  @Input() status: OperatorStatus = 'working';
  @Output() statusChanged = new EventEmitter<OperatorStatus>();
}
