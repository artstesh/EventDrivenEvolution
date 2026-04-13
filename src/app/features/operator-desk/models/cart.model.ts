import { CartItemModel } from './cart-item.model';

export interface CartModel {
  id: string;
  items: CartItemModel[];
  discount: number;
  subtotal: number;
  total: number;
}
