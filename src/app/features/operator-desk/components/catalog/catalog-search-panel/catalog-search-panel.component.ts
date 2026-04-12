import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CatalogFilters, CatalogFiltersValue } from '../catalog-filters/catalog-filters';

export interface CatalogSearchCriteria {
  query: string;
  category: string;
  availability: string;
  preset: string;
}

@Component({
  selector: 'app-catalog-search-panel',
  standalone: true,
  imports: [CommonModule, CatalogFilters],
  templateUrl: './catalog-search-panel.component.html',
  styleUrl: './catalog-search-panel.component.scss',
})
export class CatalogSearchPanelComponent {
  @Output() criteriaChanged = new EventEmitter<CatalogSearchCriteria>();

  query = '';
  category = 'Все категории';
  availability = 'Все';
  preset = 'Популярное';

  emitCriteria(): void {
    this.criteriaChanged.emit({
      query: this.query.trim(),
      category: this.category,
      availability: this.availability,
      preset: this.preset,
    });
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.emitCriteria();
  }

  onFiltersChanged(filters: Partial<CatalogFiltersValue>): void {
    if (filters.category !== undefined) {
      this.category = filters.category;
    }

    if (filters.availability !== undefined) {
      this.availability = filters.availability;
    }

    if (filters.preset !== undefined) {
      this.preset = filters.preset;
    }

    this.emitCriteria();
  }
}
