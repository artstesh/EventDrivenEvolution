import {CommonModule} from '@angular/common';
import {Component, OnInit, signal} from '@angular/core';
import {ProductCard} from '../../product-card/product-card';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {CatalogEvent} from '../../../messages/events/catalog.event';
import {CatalogSearchViewResult} from '../../../services/catalog';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid implements OnInit{
  catalog = signal< CatalogSearchViewResult|null>(null);

  constructor(private postboy: AppPostboyService) {
  }

  ngOnInit(): void {
    this.postboy.sub(CatalogEvent).subscribe(ev =>
      this.catalog.set(ev.catalog))
  }
}
