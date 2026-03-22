import { http } from "../http";
import type {
  CreditTariff,
  CreditTariffRequest,
  CreditTariffPageResponse,
  CreditRequest,
} from "./../../../types/CreditTariff";

export const creditTariffApi = {
  getAll: (params?: any) =>
    http.get<CreditTariffPageResponse>("/creditTariff/getAll", { params }),

  getById: (id: string) =>
    http.get<CreditTariff>(`/creditTariff/getById/${id}`),

  create: (data: CreditRequest) =>
    http.post<CreditRequest>("/clientCredit/create", data),

  update: (id: string, data: CreditTariffRequest) =>
    http.put<CreditTariff>(`/creditTariff/update/${id}`, data),

  delete: (id: string) =>
    http.delete(`/creditTariff/delete/${id}`, {
      data: { token: localStorage.getItem("accessToken") },
    }),
};