import {PostboyGenericMessage} from '@artstesh/postboy';
import {CatalogSearchDto} from '../../adapters/api/catalog-api.adapter';

export class CatalogSearchCommand extends PostboyGenericMessage {
  static readonly ID = 'ebb533b9-7525-4658-8305-83846334bd06';

  constructor(public filter: CatalogSearchDto) {
    super();
  }
}
