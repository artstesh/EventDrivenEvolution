import {Injectable} from '@angular/core';
import {ProductDto} from './models/product-dto';


export interface CatalogSearchDto {
  query: string;
  category: string;
  availability: string;
  preset: string;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogApiAdapter {
  async searchProducts(criteria: CatalogSearchDto): Promise<{
    items: ProductDto[];
    total: number;
    page: number;
    pageSize: number
  }> {
    void criteria;
    const rndStr =() => Math.random().toString(36).substring(2, 10);


    return {
      total: 1248,
      page: 1,
      pageSize: 24,
      items:  Array.from({length: 6}).map(() => ({
        id: `prd-${Math.floor(Math.random() * 6) + 1}`,
        sku: `SKU-${Math.floor(Math.random() * 100) + 100}`,
        name: `Product ${rndStr()}`,
        description: Array.from({length: 5}).map(() => rndStr()).join(' '),
        categoryId: `cat-${rndStr()}`,
        categoryName: criteria.category || `Category ${rndStr()}`,
        priceAmount: Math.floor(Math.random() * 10000) + 100,
        priceCurrency: "USD",
        warehouse: 'Warehouse',
        stockStatus: Math.random() < 0.5 ? 'available' : 'limited'
      }))
    };
  }
}
