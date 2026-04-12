import { Injectable } from '@angular/core';
import { StockWebSocketAdapter, StockUpdateDto } from '../adapters/websocket/stock-websocket.adapter';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private unsubscribeStock?: () => void;

  constructor(private readonly stockWebSocketAdapter: StockWebSocketAdapter) {}

  start(): void {
    this.stockWebSocketAdapter.connect();

    this.unsubscribeStock = this.stockWebSocketAdapter.subscribe((event: StockUpdateDto) => {
      console.log('Stock update event', event);
    });
  }

  stop(): void {
    this.unsubscribeStock?.();
    this.unsubscribeStock = undefined;
    this.stockWebSocketAdapter.disconnect();
  }
}
