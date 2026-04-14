import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CatalogFilters, CatalogFiltersValue } from '../catalog-filters/catalog-filters';
import {AppPostboyService} from '../../../../../shared/services/app-postboy.service';
import {CatalogSearchCommand} from '../../../messages/commands/catalog-search.command';

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

  constructor(private readonly postboy: AppPostboyService) {
  }
  query = '';
  category = 'Phones';
  availability = 'All';
  preset = 'Popular';

  emitCriteria(): void {
    this.postboy.fire(new CatalogSearchCommand({
      query: this.query.trim(),
      category: this.category,
      availability: this.availability,
      preset: this.preset,
    }));
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
