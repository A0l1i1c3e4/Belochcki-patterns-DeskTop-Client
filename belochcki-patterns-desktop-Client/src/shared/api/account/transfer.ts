import axios from "axios";

export interface Transfer {
  amount: number;
  comment: string;
  fromAccountId: string;
  toAccountId: string;
}

export const fetchTransfer = async (data: Transfer, idempotencyKey?: string) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("userId");

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
};