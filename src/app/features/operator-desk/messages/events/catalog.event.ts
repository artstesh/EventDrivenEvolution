import {PostboyGenericMessage} from '@artstesh/postboy';
import {CatalogSearchViewResult} from '../../services/catalog';

export class CatalogEvent extends PostboyGenericMessage {
  static readonly ID = 'd1f14fd4-f630-41ec-8a7c-c594cc33dddd';

  constructor(public catalog: CatalogSearchViewResult) {
    super();
  }
}
