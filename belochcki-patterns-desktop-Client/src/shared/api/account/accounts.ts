import axios from "axios";

export type statusType = "OPEN" | "CLOSE";
export type accountType = "DEBIT" | "CREDIT";
export type codeType = "RUB" | "USD" | "EUR";

export interface Account {
  id: string;
  type: accountType;
  name: string;
  balance: string;
  clientId: string;
  status: statusType;
  createdDate: string;
  createdTime: string;
  CurrencyCode: codeType;
}

export interface AccountsResponse {
  content: Account[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const fetchDebitAccounts = async (page: number, size: number): Promise<AccountsResponse> => {
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/debit-accounts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    params: {
      page: page - 1,
      size,
      sort: 'ASC',
    },
  }); 
  return response.data;
};

export const fetchCreditAccounts = async (): Promise<AccountsResponse> => {
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/credit-accounts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    params: {
      page: 0,
      size: 2,
      sort: 'ASC',
    },
  });

  return response.data;
};

export const fetchDebitAccount = async (accountId: string): Promise<Account> => {
  const id = localStorage.getItem("clientID");
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/clients/"+ id +"/debit-accounts/" + accountId + "?role=CLIENT", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }); 
  return response.data;
};

export const fetchCreditAccount = async (accountId: string): Promise<Account> => {
  const id = localStorage.getItem("clientID");
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/clients/"+ id +"/credit-accounts/" + accountId + "?role=CLIENT", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }); 
  return response.data;
};