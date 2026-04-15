import {Injectable} from '@angular/core';
import {ProductDto} from '../api/models/product-dto';

export interface StockUpdateDto {
  productId: string;
  stockStatus: 'available' | 'limited' | 'out';
  updatedAt: string;
}

type StockUpdateHandler = (event: StockUpdateDto) => void;

@Injectable({
  providedIn: 'root',
})
export class StockWebSocketAdapter {
  private handlers = new Set<StockUpdateHandler>();
  private timerId: ReturnType<typeof setInterval> | null = null;
  private productIds: string[] = [];

  connect(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      const event: StockUpdateDto = this.createRandomUpdate();
      this.handlers.forEach((handler) => handler(event));
    }, 20000);
  }

  disconnect(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  subscribe(handler: StockUpdateHandler): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  pushMockUpdate(productId: string, stockStatus: StockUpdateDto['stockStatus']): void {
    const event: StockUpdateDto = {
      productId,
      stockStatus,
      updatedAt: new Date().toISOString(),
    };

    this.handlers.forEach((handler) => handler(event));
  }

  setProductIds(ids: ProductDto[]): void {
    this.productIds = ids.map(i=> i.id);
  }

  private createRandomUpdate(): StockUpdateDto {
    const statuses: Array<StockUpdateDto['stockStatus']> = ['available', 'limited', 'out'];

    console.log(this.productIds[Math.floor(Math.random() * this.productIds.length)]);

    return {
      productId: this.productIds[Math.floor(Math.random() * this.productIds.length)] ?? 'prd-001',
      stockStatus: statuses[Math.floor(Math.random() * statuses.length)] ?? 'available',
      updatedAt: new Date().toISOString(),
    };
  }
}
