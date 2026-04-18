import axios from "axios";
import { requestWithRetry } from "../requestWithRetry";

export interface Transfer {
  amount: number;
  comment: string;
  fromAccountId: string;
  toAccountId: string;
}

export const fetchTransfer = async (data: Transfer, idempotencyKey?: string) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("userId");

  return requestWithRetry({
    operationName: "debit-transfer",
    idempotencyKey,
    request: async () => {
      const response = await axios.post(
        "http://localhost:8085/api/gateway/accounts/clients/" + id + "/debit-accounts/transfer",
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