import {CommonModule, NgIf} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-order-history-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './order-history-modal.html',
  styleUrl: './order-history-modal.scss',
})
export class OrderHistoryModal {
  @Input() opened = false;

  @Output() closed = new EventEmitter<void>();
}
