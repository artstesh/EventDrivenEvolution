import { MoneyModel } from './money.model';
import { ProductCategoryModel } from './product-category.model';
import { StockStatusModel } from './stock-status.model';

export interface ProductModel {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategoryModel;
  price: MoneyModel;
  stockStatus: StockStatusModel;
  warehouse: string;
}
