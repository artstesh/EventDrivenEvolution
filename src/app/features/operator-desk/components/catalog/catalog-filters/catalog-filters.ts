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
  @Input() category = 'Available';
  @Input() availability = 'All';
  @Input() preset = 'Popular';

  @Output() categoryChanged = new EventEmitter<string>();
  @Output() availabilityChanged = new EventEmitter<string>();
  @Output() presetChanged = new EventEmitter<string>();

  readonly categories = ['Phones', 'Laptops', 'Computers'];
  readonly availabilityOptions = ['All', 'Available', 'Order only', 'Sold out'];
  readonly presets = ['Popular', 'Discounts', 'New'];

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
