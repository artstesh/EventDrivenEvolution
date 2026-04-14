import {PostboyExecutionHandler, PostboyExecutor} from '@artstesh/postboy';
import {ProductModel} from '../../models/product.model';
import {ProductCardVm} from '../../models/product-card-vm';

export class ProductModelToVmExecutor extends PostboyExecutor<ProductCardVm> {
  static readonly ID = '59bd5432-c7b6-4070-8189-b34f637a4504';

  constructor(public model: ProductModel) {
    super();
  }
}

export class ProductModelToVmExecutorHandler extends PostboyExecutionHandler<ProductCardVm, ProductModelToVmExecutor> {

  handle(executor: ProductModelToVmExecutor): ProductCardVm {
    return {
      category: executor.model.category.name,
      name: executor.model.name,
      description: executor.model.description,
      sku: executor.model.sku,
      warehouse: executor.model.warehouse,
      price: executor.model.price,
      stockState: executor.model.stockStatus,
      stockLabel: this.getStockLabel(executor.model.stockStatus),
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
