export type CreditStatus = "ACTIVE" | "CLOSED" | "OVERDUE";

export interface ClientCredit {
  id: string;
  creditTariffId: string;
  clientId: string;
  issueDate: string;
  issueTime: string;
  creditAmount: number;
  debtAmount: number;
  creditStatus: CreditStatus;
  lastPaymentDate: string;
}

export interface CreditDebt {
  creditId: string;
  debtAmount: number;
  creditAmount: number;
  lastDepositDate: string;
}

export interface CreditOperation {
  id: string;
  clientCreditId: string;
  operationType: string;
  amount: number;
  date: string;
}


export type PageResponse<T> = {
  data: T[];
  size: number;
  page: number;
  totalElements: number;
};