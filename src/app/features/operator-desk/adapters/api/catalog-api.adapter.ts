import { Injectable } from '@angular/core';

export interface ProductDto {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  priceAmount: number;
  priceCurrency: 'RUB' | 'USD' | 'EUR';
  warehouse: string;
  stockStatus: 'available' | 'limited' | 'out';
}

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
  async searchProducts(criteria: CatalogSearchDto): Promise<{ items: ProductDto[]; total: number; page: number; pageSize: number }> {
    void criteria;

    return {
      total: 1248,
      page: 1,
      pageSize: 24,
      items: [
        {
          id: 'prd-001',
          sku: 'PX-256-BLK',
          name: 'Смартфон X Pro 256 GB',
          description: 'Флагманская модель с OLED-дисплеем и быстрой зарядкой.',
          categoryId: 'cat-phones',
          categoryName: 'Смартфоны',
          priceAmount: 49990,
          priceCurrency: 'RUB',
          warehouse: 'Центральный',
          stockStatus: 'available',
        },
        {
          id: 'prd-002',
          sku: 'CASE-PREM-01',
          name: 'Чехол защитный Premium',
          description: 'Ударопрочный чехол с повышенной защитой углов.',
          categoryId: 'cat-accessories',
          categoryName: 'Аксессуары',
          priceAmount: 1490,
          priceCurrency: 'RUB',
          warehouse: 'Северный',
          stockStatus: 'limited',
        },
        {
          id: 'prd-003',
          sku: 'AUDIO-STMAX',
          name: 'Наушники Studio Max',
          description: 'Премиальные наушники для ежедневной работы и поездок.',
          categoryId: 'cat-electronics',
          categoryName: 'Электроника',
          priceAmount: 12990,
          priceCurrency: 'RUB',
          warehouse: 'Центральный',
          stockStatus: 'out',
        },
      ],
    };
  }
}
