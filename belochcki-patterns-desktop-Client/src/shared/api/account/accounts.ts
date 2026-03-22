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
  data: Account[];
}

export const fetchDebitAccounts = async (): Promise<Account[]> => {
  const id = localStorage.getItem("userId");
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/clients/"+ id +"/debit-accounts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }); 
  console.log(response.data)
  return response.data;
};

export const fetchCreditAccounts = async (): Promise<Account[]> => {
  const id = localStorage.getItem("userId");
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/clients/"+ id +"/credit-accounts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response.data;
};

export const fetchDebitAccount = async (accountId: string): Promise<Account> => {
  const id = localStorage.getItem("userId");
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/clients/"+ id +"/debit-accounts/" + accountId + "?role=CLIENT", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }); 
  return response.data;
};

export const fetchCreditAccount = async (accountId: string): Promise<Account> => {
  const id = localStorage.getItem("userId");
  const response = await axios.get("http://localhost:8085/api/gateway/accounts/clients/"+ id +"/credit-accounts/" + accountId + "?role=CLIENT", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }); 
  return response.data;
};