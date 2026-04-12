import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CatalogFiltersValue {
  category: string;
  availability: string;
  preset: string;
}

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-filters.html',
  styleUrl: './catalog-filters.scss',
})
export class CatalogFilters {
  @Input() category = 'Все категории';
  @Input() availability = 'Все';
  @Input() preset = 'Популярное';

  @Output() categoryChanged = new EventEmitter<string>();
  @Output() availabilityChanged = new EventEmitter<string>();
  @Output() presetChanged = new EventEmitter<string>();

  readonly categories = ['Все категории', 'Смартфоны', 'Аксессуары', 'Электроника'];
  readonly availabilityOptions = ['Все', 'В наличии', 'Под заказ', 'Нет в наличии'];
  readonly presets = ['Популярное', 'Скидки', 'Новинки'];

  setCategory(value: string): void {
    this.categoryChanged.emit(value);
  }

  setAvailability(value: string): void {
    this.availabilityChanged.emit(value);
  }

  setPreset(value: string): void {
    this.presetChanged.emit(value);
  }
}
