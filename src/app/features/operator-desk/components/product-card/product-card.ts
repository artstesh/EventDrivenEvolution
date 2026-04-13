import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StockBadge, StockBadgeState } from './components/stock-badge/stock-badge';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [StockBadge],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() category = '';
  @Input() name = '';
  @Input() description = '';
  @Input() sku = '';
  @Input() warehouse = '';
  @Input() price = 0;
  @Input() stockState: StockBadgeState = 'available';
  @Input() stockLabel = '';

  @Output() addToCart = new EventEmitter<void>();
}
