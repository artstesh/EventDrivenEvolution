import {Currency} from './currency.enum';

export interface CustomerDto {
  id: string;
  fullName: string;
  isVip: boolean;
  balanceAmount: number;
  balanceCurrency: Currency;
  loyaltyLevel?: string;
  segment?: string;
  lastOrderAt?: string;
}
