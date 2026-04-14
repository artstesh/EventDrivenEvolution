import {ProductModel} from '../../models/product.model';
import {PostboyExecutionHandler, PostboyExecutor} from '@artstesh/postboy';
import {ProductDto} from '../../adapters/api/models/product-dto';
import {ProductCategoryModel} from '../../models/product-category.model';

export class ProductDtoToModelExecutor extends PostboyExecutor<ProductModel> {
  static readonly ID = '01ead8f7-9e67-4ec0-9950-905614fed950';

  constructor(public dto: ProductDto) {
    super();
  }
}

export class ProductDtoToModelExecutorHandler extends PostboyExecutionHandler<ProductModel, ProductDtoToModelExecutor> {

  handle(executor: ProductDtoToModelExecutor): ProductModel {
    return {
      id: executor.dto.id,
      sku: executor.dto.sku,
      name: executor.dto.name,
      description: executor.dto.description,
      category: this.mapCategory(executor.dto.categoryId, executor.dto.categoryName),
      price: executor.dto.priceAmount,
      stockStatus: executor.dto.stockStatus,
      warehouse: executor.dto.warehouse,
    };
  }

  mapCategory(id: string, name: string): ProductCategoryModel {
    return {
      id,
      name,
      code: id,
    };
  }
}
