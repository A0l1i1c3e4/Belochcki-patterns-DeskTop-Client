import axios from "axios";

export type OperationType =
  | "OPEN"
  | "CLOSE"
  | "DEPOSIT"
  | "WITHDRAW"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "CREDIT_SERVICE_WITHDRAW";

export interface AccountOperation {
  id: string;
  accountId: string;
  date: string;
  time: string;
  amount: number;
  comment: string;
  operationType: OperationType;
}

export interface AccountOperationsResponse {
  content: AccountOperation[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const fetchDebitAccountOperations = async (
  accountId: string | undefined,
  page = 1,
  size = 200
): Promise<AccountOperationsResponse> => {
  const clientId = localStorage.getItem("clientID");

  const response = await axios.get(
    `http://localhost:8085/api/gateway/accounts/clients/${clientId}/accounts/${accountId}/operations`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      params: {
        accountType: "DEBIT",
        page: page - 1,
        size,
        sort: ["date,desc", "time,desc"],
      },
    }
  );

  return response.data;
};