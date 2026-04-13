import {Currency} from './currency.enum';

export interface ProductDto {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  priceAmount: number;
  priceCurrency: Currency;
  warehouse: string;
  stockStatus: 'available' | 'limited' | 'out';
}
