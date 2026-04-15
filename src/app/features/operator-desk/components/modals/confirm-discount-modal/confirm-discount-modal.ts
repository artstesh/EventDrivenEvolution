import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DiscountApprovalService} from '../../../services/discount-approval';
import {CartModel} from '../../../models/cart.model';
import {Subscription} from 'rxjs';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {PushNotificationCommand} from '../../../messages/commands/push-notification.command';
import {CloseModalsCommand} from '../../../messages/commands/close-modals.command';
import {CartStateEvent} from '../../../messages/events/cart-state.event';
import {ConfirmOrderCommand} from '../../../messages/commands/confirm-order.command';
import {ClearCartCommand} from '../../../messages/commands/clear-cart.command';

@Component({
  selector: 'app-confirm-discount-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './confirm-discount-modal.html',
  styleUrl: './confirm-discount-modal.scss',
})
export class ConfirmDiscountModal implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  discountReason = '';
  cart = signal<CartModel | null>(null);

  constructor(
    private readonly discountApprovalService: DiscountApprovalService,
    private readonly postboy: AppPostboyService) {
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(CartStateEvent).subscribe(ev =>
      this.cart.set(ev.cart)))
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.postboy.fire(new CloseModalsCommand());
  }

  onConfirm(): void {
    const discountReason = this.discountApprovalService.createDiscountReason(this.discountReason.trim());
    this.postboy.fire(new PushNotificationCommand('success', 'Discount accepted', discountReason.text || 'Discount reason did not set.'));
    this.postboy.fire(new ConfirmOrderCommand());
    this.postboy.fire(new CloseModalsCommand());
    this.postboy.fire(new ClearCartCommand());
  }
}
