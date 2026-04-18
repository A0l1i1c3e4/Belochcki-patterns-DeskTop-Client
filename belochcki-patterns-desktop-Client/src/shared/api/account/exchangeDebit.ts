import axios from "axios";
import { requestWithRetry } from "../requestWithRetry";

export type OperationType = "withdraw" | "deposit";

export interface DebitExchange {
  amount: number;
  comment: string;
}

export const fetchExchangeAccounts = async (
  data: DebitExchange,
  accountId: string,
  operationType: OperationType,
  accountType: string,
  idempotencyKey?: string
) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("userId");

  return requestWithRetry({
    operationName: `${accountType}-${operationType}`,
    idempotencyKey,
    request: async () => {
      const response = await axios.post(
        "http://localhost:8085/api/gateway/accounts/clients/" +
          id +
          "/" +
          accountType +
          "-accounts/" +
          accountId +
          "/" +
          operationType,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
          },
        }
      );

      return response.data;
    },
  });
};

export const fetchCloseDebitAccounts = async (
  accountId: string,
  idempotencyKey?: string
) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("userId");

  return requestWithRetry({
    operationName: "debit-close",
    idempotencyKey,
    request: async () => {
      const response = await axios.post(
        "http://localhost:8085/api/gateway/accounts/clients/" +
          id +
          "/debit-accounts/" +
          accountId +
          "/close",
        "123",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
          },
        }
      );

      return response.data;
    },
  });
};