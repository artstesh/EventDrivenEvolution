import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCard } from '../../product-card/product-card';
import { StockBadgeState } from '../../product-card/components/stock-badge/stock-badge';

export interface ProductCardVm {
  category: string;
  name: string;
  description: string;
  sku: string;
  warehouse: string;
  price: number;
  stockState: StockBadgeState;
  stockLabel: string;
}

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  @Input() totalCount = 1248;
  @Input() displayedCount = 24;
  @Input() currentPage = 1;
  @Input() totalPages = 52;

  @Input() products: ProductCardVm[] = [];

  @Output() addToCart = new EventEmitter<ProductCardVm>();
}
