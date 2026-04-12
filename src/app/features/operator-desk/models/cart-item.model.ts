import { MoneyModel } from './money.model';
import { ProductModel } from './product.model';

export interface CartItemModel {
  id: string;
  product: ProductModel;
  quantity: number;
  unitPrice: MoneyModel;
  totalPrice: MoneyModel;
}
