
export interface CustomerModel {
  id: string;
  fullName: string;
  isVip: boolean;
  balance: number;
  loyaltyLevel?: string;
  segment?: string;
  lastOrderAt?: string;
}
