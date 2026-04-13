import { Injectable } from '@angular/core';
import { CatalogApiAdapter, CatalogSearchDto } from '../adapters/api/catalog-api.adapter';
import { ProductMapper, ProductCardVm } from '../mappers/product.mapper';
import { ProductModel } from '../models/product.model';
import {ProductDto} from '../adapters/api/models/product-dto';

export interface CatalogSearchResult {
  items: ProductModel[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CatalogSearchViewResult {
  items: ProductCardVm[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(
    private readonly catalogApiAdapter: CatalogApiAdapter,
    private readonly productMapper: ProductMapper,
  ) {}

  async search(criteria: CatalogSearchDto): Promise<CatalogSearchViewResult> {
    const response = await this.catalogApiAdapter.searchProducts(criteria);

    return {
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      items: response.items.map((item: ProductDto) => this.productMapper.mapDtoToModel(item)).map((model) =>
        this.productMapper.mapModelToCardVm(model),
      ),
    };
  }

  async searchModels(criteria: CatalogSearchDto): Promise<CatalogSearchResult> {
    const response = await this.catalogApiAdapter.searchProducts(criteria);

    return {
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      items: response.items.map((item: ProductDto) => this.productMapper.mapDtoToModel(item)),
    };
  }
}
