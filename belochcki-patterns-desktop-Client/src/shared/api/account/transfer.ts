import axios from "axios";

export interface Transfer {
  amount: number;
  comment: string;
  fromAccountId: string;
  toAccountId: string;
}

export const fetchTransfer = async (data: Transfer) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("clientID");
  const response = await axios.post("http://localhost:8085/api/gateway/accounts/clients/" + id + "/debit-accounts/transfer", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};