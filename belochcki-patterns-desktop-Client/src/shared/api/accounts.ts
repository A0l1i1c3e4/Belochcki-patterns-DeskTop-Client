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
  currencyCode: codeType;
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
    },
  });

  return response.data;
};