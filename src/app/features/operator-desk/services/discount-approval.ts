import {Injectable} from '@angular/core';
import {DiscountReasonModel} from '../models/discount-reason.model';

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
}
