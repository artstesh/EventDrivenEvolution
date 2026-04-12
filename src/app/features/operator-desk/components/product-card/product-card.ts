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
  @Input() category = 'Смартфоны';
  @Input() name = 'Смартфон X Pro 256 GB';
  @Input() description = 'Флагманская модель с OLED-дисплеем, быстрой зарядкой и расширенной гарантией.';
  @Input() sku = 'PX-256-BLK';
  @Input() warehouse = 'Центральный';
  @Input() price = '49 990 ₽';
  @Input() stockState: StockBadgeState = 'available';
  @Input() stockLabel = 'В наличии';

  @Output() addToCart = new EventEmitter<void>();
}
