import {PostboyGenericMessage} from '@artstesh/postboy';
import {OperatorSessionModel} from '../../models/operator-session.model';

export class OperatorSessionEvent extends PostboyGenericMessage {
  static readonly ID = '851dbf98-227a-4c73-b665-5479bcb308df';

  constructor(public session: OperatorSessionModel) {
    super();
  }
}
