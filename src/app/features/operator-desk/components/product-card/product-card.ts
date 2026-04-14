import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import { StockBadge, StockBadgeState } from './components/stock-badge/stock-badge';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {AddItemToCartCommand} from '../../messages/commands/add-item-to-cart.command';
import {ProductCardVm} from '../../models/product-card-vm';
import {ProductCardToProductModelExecutor} from '../../messages/executors/product-card-to-product-model.executor';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [StockBadge],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<ProductCardVm>();

  constructor(private postboy: AppPostboyService) {
  }

  addToCartClicked(): void {
    this.postboy.fire(new AddItemToCartCommand(this.postboy.exec(new ProductCardToProductModelExecutor(this.product()))))
  }
}
