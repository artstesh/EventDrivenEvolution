import {CommonModule, NgIf} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-confirm-discount-modal',
  standalone: true,
  imports: [ FormsModule, NgIf],
  templateUrl: './confirm-discount-modal.html',
  styleUrl: './confirm-discount-modal.scss',
})
export class ConfirmDiscountModal {
  @Input() opened = false;

  @Input() cartSubtotal = '0 ₽';
  @Input() discount = '0 ₽';
  @Input() total = '0 ₽';

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<string>();

  discountReason = '';

  onConfirm(): void {
    this.confirmed.emit(this.discountReason.trim());
  }
}
