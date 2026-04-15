import {CustomerModel} from './customer.model';

export type CallStatusModel = 'incoming' | 'active' | 'ended' | 'waiting';

export interface CallModel {
  id: string;
  customer: CustomerModel;
  startedAt: string;
  status: CallStatusModel;
  durationSeconds: number;
}
