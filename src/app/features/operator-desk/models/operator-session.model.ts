import { CallModel } from './call.model';
import { CartModel } from './cart.model';

export type OperatorStatusModel = 'working' | 'away';

export interface OperatorSessionModel {
  operatorId: string;
  operatorName: string;
  status: OperatorStatusModel;
  activeCall?: CallModel;
  activeCart?: CartModel;
  workingSince?: string;
}
