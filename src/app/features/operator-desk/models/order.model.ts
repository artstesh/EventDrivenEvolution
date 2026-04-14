import { CartItemModel } from './cart-item.model';
import { DiscountReasonModel } from './discount-reason.model';
import { CustomerModel } from './customer.model';

export type OrderStatusModel = 'draft' | 'confirmed' | 'cancelled' | 'completed';

export interface OrderModel {
  id: string;
  customer: CustomerModel;
  items: CartItemModel[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatusModel;
  discountReason?: DiscountReasonModel;
  createdAt: Date;
  confirmedAt?: Date;
}
