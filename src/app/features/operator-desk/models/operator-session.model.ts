import {CartModel} from './cart.model';

export type OperatorStatusModel = 'working' | 'away';

export interface OperatorSessionModel {
  operatorId: string;
  operatorName: string;
  status: OperatorStatusModel;
  activeCart?: CartModel;
  workingSince?: string;
}
