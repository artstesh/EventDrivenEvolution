import { CartItemModel } from './cart-item.model';
import { DiscountReasonModel } from './discount-reason.model';
import { MoneyModel } from './money.model';
import { CustomerModel } from './customer.model';

export type OrderStatusModel = 'draft' | 'confirmed' | 'cancelled' | 'completed';

export interface OrderModel {
  id: string;
  customer: CustomerModel;
  items: CartItemModel[];
  subtotal: MoneyModel;
  discount: MoneyModel;
  total: MoneyModel;
  status: OrderStatusModel;
  discountReason?: DiscountReasonModel;
  createdAt: string;
  confirmedAt?: string;
}
