import { Injectable } from '@angular/core';
import { MoneyModel } from '../models/money.model';
import { ProductCategoryModel } from '../models/product-category.model';
import { ProductModel } from '../models/product.model';
import { ProductDto } from '../adapters/api/catalog-api.adapter';
import { StockBadgeState } from '../components/product-card/components/stock-badge/stock-badge';

export interface ProductCardVm {
  category: string;
  name: string;
  description: string;
  sku: string;
  warehouse: string;
  price: string;
  stockState: StockBadgeState;
  stockLabel: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductMapper {
  mapDtoToModel(dto: ProductDto): ProductModel {
    return {
      id: dto.id,
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      category: this.mapCategory(dto.categoryId, dto.categoryName),
      price: this.mapMoney(dto.priceAmount, dto.priceCurrency),
      stockStatus: dto.stockStatus,
      warehouse: dto.warehouse,
    };
  }

  mapModelToCardVm(model: ProductModel): ProductCardVm {
    return {
      category: model.category.name,
      name: model.name,
      description: model.description,
      sku: model.sku,
      warehouse: model.warehouse,
      price: this.formatMoney(model.price),
      stockState: model.stockStatus,
      stockLabel: this.getStockLabel(model.stockStatus),
    };
  }

  toDomainProduct(vm: ProductCardVm): ProductModel {
    const categoryName = vm.category.trim() || 'Без категории';

    return {
      id: vm.sku,
      sku: vm.sku,
      name: vm.name,
      description: vm.description,
      category: this.mapCategory(categoryName, categoryName),
      price: this.parseMoney(vm.price),
      stockStatus: vm.stockState,
      warehouse: vm.warehouse,
    };
  }

  mapCategory(id: string, name: string): ProductCategoryModel {
    return {
      id,
      name,
      code: id,
    };
  }

  mapMoney(amount: number, currency: MoneyModel['currency']): MoneyModel {
    return {
      amount,
      currency,
    };
  }

  private parseMoney(value: string): MoneyModel {
    const amount = Number(value.replace(/[^\d]/g, '')) || 0;

    return {
      amount,
      currency: 'RUB',
    };
  }

  private formatMoney(money: MoneyModel): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(money.amount);
  }

  private getStockLabel(status: ProductModel['stockStatus']): string {
    switch (status) {
      case 'available':
        return 'В наличии';
      case 'limited':
        return 'Ограничено';
      case 'out':
        return 'Нет в наличии';
      default:
        return 'В наличии';
    }
  }
}
