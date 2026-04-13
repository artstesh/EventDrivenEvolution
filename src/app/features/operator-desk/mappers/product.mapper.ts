import {Injectable} from '@angular/core';
import {ProductCategoryModel} from '../models/product-category.model';
import {ProductModel} from '../models/product.model';
import {StockBadgeState} from '../components/product-card/components/stock-badge/stock-badge';
import {ProductDto} from '../adapters/api/models/product-dto';

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
      price: dto.priceAmount,
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
      price: model.price,
      stockState: model.stockStatus,
      stockLabel: this.getStockLabel(model.stockStatus),
    };
  }

  toDomainProduct(vm: ProductCardVm): ProductModel {
    const categoryName = vm.category.trim() || 'No';

    return {
      id: vm.sku,
      sku: vm.sku,
      name: vm.name,
      description: vm.description,
      category: this.mapCategory(categoryName, categoryName),
      price: vm.price,
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

  private getStockLabel(status: ProductModel['stockStatus']): string {
    switch (status) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited';
      case 'out':
        return 'Out';
      default:
        return 'Available';
    }
  }
}
