import {StockBadgeState} from '../components/product-card/components/stock-badge/stock-badge';

export interface ProductCardVm {
  category: string;
  name: string;
  description: string;
  sku: string;
  warehouse: string;
  price: number;
  stockState: StockBadgeState;
  stockLabel: string;
}
