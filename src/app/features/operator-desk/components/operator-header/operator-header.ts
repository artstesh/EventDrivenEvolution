import { Component, Input } from '@angular/core';
import { OperatorStatus } from '../call-panel/operator-status-switch/operator-status-switch';

@Component({
  selector: 'app-operator-header',
  standalone: true,
  imports: [],
  templateUrl: './operator-header.html',
  styleUrl: './operator-header.scss',
})
export class OperatorHeader {
  @Input() status: OperatorStatus = 'working';
  @Input() queueSize = 0;
  @Input() shiftLabel = '08:00–20:00';
}
