import {ProductModel} from '../../models/product.model';
import {PostboyExecutionHandler, PostboyExecutor} from '@artstesh/postboy';
import {ProductCardVm} from '../../models/product-card-vm';
import {ProductCategoryModel} from '../../models/product-category.model';

export class ProductCardToProductModelExecutor extends PostboyExecutor<ProductModel> {
  static readonly ID = '042c2258-52d4-4f1b-911b-87086ff08ee1';

  constructor(public card: ProductCardVm) {
    super();
  }
}

export class ProductCardToProductModelExecutorHandler extends PostboyExecutionHandler<ProductModel, ProductCardToProductModelExecutor> {

  handle(executor: ProductCardToProductModelExecutor): ProductModel {
    const categoryName = executor.card.category.trim() || 'No';
    return {
      id: executor.card.sku,
      sku: executor.card.sku,
      name: executor.card.name,
      description: executor.card.description,
      category: this.mapCategory(categoryName, categoryName),
      price: executor.card.price,
      stockStatus: executor.card.stockState,
      warehouse: executor.card.warehouse,
    };
  }

  private mapCategory(id: string, name: string): ProductCategoryModel {
    return {
      id,
      name,
      code: id,
    };
  }
}
