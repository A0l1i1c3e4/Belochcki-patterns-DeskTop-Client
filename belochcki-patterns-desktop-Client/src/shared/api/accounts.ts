import axios from "axios";

export type statusType = "OPEN" | "CLOSE";
export type codeType = "RUB" | "USD" | "EUR";

export interface Account {
  id: string;
  name: string;
  balance: string;
  clientId: string;
  status: statusType;
  createdDate: string;
  CurrencyCode: codeType;
}

export interface AccountsResponse {
  content: Account[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

//eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjOGQ0MGVlYi02ZWY2LTQ2MDQtOTk0OC0yZmVjMWMyMTgwYjkiLCJzY29wZSI6IkVNUExPWUVFIENMSUVOVCIsImxvZ2luIjoic3RyaW5nIiwiaWF0IjoxNzc0MTA2OTYyLCJleHAiOjE3NzQxMTA1NjJ9.jbtlhty_kzIt0atvOE5VHYf5Y5w_8ItzJp6v90FebEY

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