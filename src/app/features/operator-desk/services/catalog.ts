import {Injectable} from '@angular/core';
import {CatalogApiAdapter, CatalogSearchDto} from '../adapters/api/catalog-api.adapter';
import {ProductDto} from '../adapters/api/models/product-dto';
import {AppPostboyService} from '../../../shared/services/app-postboy.service';
import {IPostboyDependingService} from '@artstesh/postboy';
import {CatalogEvent} from '../messages/events/catalog.event';
import {CatalogSearchCommand} from '../messages/commands/catalog-search.command';
import {StockWebSocketAdapter} from '../adapters/websocket/stock-websocket.adapter';
import {PushNotificationCommand} from '../messages/commands/push-notification.command';
import {StockUpdateEvent} from '../messages/events/stock-update.event';
import {ProductCardVm} from '../models/product-card-vm';
import {ProductDtoToModelExecutor} from '../messages/executors/product-dto-to-model.executor';
import {ProductModelToVmExecutor} from '../messages/executors/product-model-to-vm.executor';


export interface CatalogSearchViewResult {
  items: ProductCardVm[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogService implements IPostboyDependingService {
  private namespace = 'catalog-service';

  constructor(private postboy: AppPostboyService,
              private readonly catalogApiAdapter: CatalogApiAdapter,
              private readonly stockWebSocketAdapter: StockWebSocketAdapter) {
    postboy.addNamespace(this.namespace)
      .recordBehavior(CatalogSearchCommand, new CatalogSearchCommand({
        query: '',
        category: 'Phones',
        availability: 'All',
        preset: 'Popular',
      }))
      .recordSubject(StockUpdateEvent)
      .recordReplay(CatalogEvent);
  }

  up(): void {
    this.stockWebSocketAdapter.connect();
    this.postboy.sub(CatalogSearchCommand).subscribe((cmd) => this.search(cmd.filter));
    this.stockWebSocketAdapter.subscribe((event) => {
      this.postboy.fire(new StockUpdateEvent(event));
      this.postboy.fire(new PushNotificationCommand('info', 'Updated', `The product ${event.productId} has status ${event.stockStatus} now.`));
    });
  }


  private async search(criteria: CatalogSearchDto): Promise<void> {
    const response = await this.catalogApiAdapter.searchProducts(criteria);

    this.postboy.fire(new CatalogEvent({
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      items: response.items.map((item: ProductDto) =>
        this.postboy.exec(new ProductDtoToModelExecutor(item))).map((model) =>
        this.postboy.exec(new ProductModelToVmExecutor(model)),
      ),
      totalPages: Math.max(1, Math.ceil(response.total / response.pageSize))
    }));
  }

  down = () => this.postboy.eliminateNamespace(this.namespace);
}
