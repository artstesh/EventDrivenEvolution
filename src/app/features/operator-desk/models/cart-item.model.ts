import {ProductModel} from './product.model';

export interface CartItemModel {
  id: string;
  product: ProductModel;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
