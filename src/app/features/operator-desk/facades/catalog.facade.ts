import { Injectable } from '@angular/core';
import { CatalogSearchDto } from '../adapters/api/catalog-api.adapter';
import { StockWebSocketAdapter, StockUpdateDto } from '../adapters/websocket/stock-websocket.adapter';
import {CatalogSearchViewResult, CatalogService} from '../services/catalog';
import {NotificationService} from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class CatalogFacade {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly notificationService: NotificationService,
    private readonly stockWebSocketAdapter: StockWebSocketAdapter,
  ) {}

  async search(criteria: CatalogSearchDto): Promise<CatalogSearchViewResult> {
    return this.catalogService.search(criteria);
  }

  startStockFeed(onUpdate?: (event: StockUpdateDto) => void): void {
    this.stockWebSocketAdapter.connect();

    if (onUpdate) {
      this.stockWebSocketAdapter.subscribe((event) => {
        onUpdate(event);

        this.notificationService.push({
          type: 'info',
          title: 'Updated',
          message: `The product ${event.productId} has status ${event.stockStatus} now.`,
        });
      });
    }
  }

  simulateStockUpdate(productId: string, stockStatus: StockUpdateDto['stockStatus']): void {
    this.stockWebSocketAdapter.pushMockUpdate(productId, stockStatus);
  }
}
