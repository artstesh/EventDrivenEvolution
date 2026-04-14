import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NotificationFacade} from '../../../facades/notification.facade';
import {DiscountApprovalService} from '../../../services/discount-approval';
import {CartFacade} from '../../../facades/cart.facade';
import {CartModel} from '../../../models/cart.model';
import {Subscription} from 'rxjs';
import {ModalFacade} from '../../../facades/modal.facade';
import {OrderFacade} from '../../../facades/order.facade';

@Component({
  selector: 'app-confirm-discount-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './confirm-discount-modal.html',
  styleUrl: './confirm-discount-modal.scss',
})
export class ConfirmDiscountModal  implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  discountReason = '';
  cart = signal<CartModel | null>(null);

  constructor(
    private readonly discountApprovalService: DiscountApprovalService,
    private readonly notificationFacade: NotificationFacade,
    private readonly cartFacade: CartFacade,
    private readonly modalFacade: ModalFacade,
    private readonly orderFacade: OrderFacade) {
  }

  ngOnInit(): void {
    this.subs.push(this.cartFacade.cart.subscribe(cart =>
      this.cart.set(cart)))
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.modalFacade.close();
  }

  onConfirm(): void {
    const discountReason = this.discountApprovalService.createDiscountReason(this.discountReason.trim());
    this.notificationFacade.push({
      type: 'success',
      title: 'Discount accepted',
      message: discountReason.text || 'Discount reason did not set.',
    });
    this.orderFacade.confirmOrder(discountReason);
    this.modalFacade.close();
    this.cartFacade.clearCart();
  }
}
