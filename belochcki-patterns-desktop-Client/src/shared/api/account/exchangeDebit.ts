import axios from "axios";

export type OperationType = "withdraw" | "deposit";

export interface DebitExchange {
  amount: number;
  comment: string;
}

export const fetchExchangeAccounts = async (data: DebitExchange, accountId: string, operationType: OperationType, accountType: string) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("clientID");
  const response = await axios.post("http://localhost:8085/api/gateway/accounts/clients/" + id + "/" + accountType + "-accounts/" + accountId + "/" + operationType, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchCloseDebitAccounts = async (accountId: string) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("clientID");
  const response = await axios.post("http://localhost:8085/api/gateway/accounts/clients/" + id + "/debit-accounts/" + accountId + "/close", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};