export interface ProductDto {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  priceAmount: number;
  priceCurrency: string;
  warehouse: string;
  stockStatus: 'available' | 'limited' | 'out';
}
