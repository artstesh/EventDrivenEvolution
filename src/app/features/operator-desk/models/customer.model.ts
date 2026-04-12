import { MoneyModel } from './money.model';

export interface CustomerModel {
  id: string;
  fullName: string;
  isVip: boolean;
  balance: MoneyModel;
  loyaltyLevel?: string;
  segment?: string;
  lastOrderAt?: string;
}
