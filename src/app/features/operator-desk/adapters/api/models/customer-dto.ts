export interface CustomerDto {
  id: string;
  fullName: string;
  isVip: boolean;
  balanceAmount: number;
  balanceCurrency: string;
  loyaltyLevel?: string;
  segment?: string;
  lastOrderAt?: string;
}
