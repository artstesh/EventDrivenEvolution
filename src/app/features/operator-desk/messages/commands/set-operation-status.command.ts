import {PostboyGenericMessage} from '@artstesh/postboy';
import {OperatorStatus} from '../../components/call-panel/operator-status-switch/operator-status-switch';

export class SetOperationStatusCommand extends PostboyGenericMessage {
  static readonly ID = '935bbcc6-b823-48a7-821f-03ab368bad16';

  constructor(public model: {status?: OperatorStatus, toggle?: boolean}) {
    super();
  }
}
