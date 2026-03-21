import axios from "axios";

export interface AccountQuery {
  currencyCode: string;
}

export const fetchCreateDebitAccounts = async (data: AccountQuery) => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("clientID");
  const response = await axios.post("http://localhost:8085/api/gateway/accounts/clients/" +  id + "/debit-accounts", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};