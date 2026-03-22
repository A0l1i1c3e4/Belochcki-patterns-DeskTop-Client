export interface CreditTariff {
  id: string;
  name: string;
  description?: string;
  amountFrom: number;
  amountTo: number;
  interestRate: number;
}

export interface CreditTariffRequest {
  name: string;
  description?: string;
  amountFrom: number;
  amountTo: number;
  interestRate: number;
}

export interface CreditTariffPageResponse {
  data: CreditTariff[];
  totalElements: number;
}