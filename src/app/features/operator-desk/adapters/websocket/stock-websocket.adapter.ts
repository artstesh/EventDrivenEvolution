import {Injectable} from '@angular/core';

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

  connect(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      const event: StockUpdateDto = this.createRandomUpdate();
      this.handlers.forEach((handler) => handler(event));
    }, 8000);
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

  private createRandomUpdate(): StockUpdateDto {
    const productIds = ['prd-001', 'prd-002', 'prd-003'];
    const statuses: Array<StockUpdateDto['stockStatus']> = ['available', 'limited', 'out'];

    return {
      productId: productIds[Math.floor(Math.random() * productIds.length)] ?? 'prd-001',
      stockStatus: statuses[Math.floor(Math.random() * statuses.length)] ?? 'available',
      updatedAt: new Date().toISOString(),
    };
  }
}
