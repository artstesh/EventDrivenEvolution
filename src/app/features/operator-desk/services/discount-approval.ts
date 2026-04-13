import { Injectable } from '@angular/core';
import { DiscountReasonModel } from '../models/discount-reason.model';
import { CartModel } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class DiscountApprovalService {
  createDiscountReason(text: string, approvedBy = 'supervisor'): DiscountReasonModel {
    return {
      text,
      approvedBy,
      approvedAt: new Date().toISOString(),
    };
  }

  applyDiscount(cart: CartModel, discountAmount: number, reason: DiscountReasonModel): CartModel {
    void reason;

    return {
      ...cart,
      discount: discountAmount,
      total: Math.max(0, cart.subtotal - discountAmount)
    };
  }
}
