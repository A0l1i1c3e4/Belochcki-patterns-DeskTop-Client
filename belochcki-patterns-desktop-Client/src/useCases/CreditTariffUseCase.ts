import { creditTariffApi } from "../shared/api/tariffs/CreditTariffApi";
import type {
  CreditTariff,
  CreditTariffRequest,
  CreditRequest,
} from "../types/CreditTariff";

export const creditTariffUseCase = {
  getTariffs: async () => {
    const res = await creditTariffApi.getAll();
    return res.data;
  },

  getById: async (id: string): Promise<CreditTariff> => {
    return await creditTariffApi.getById(id);
  },

  create: async (data: CreditRequest) => {
    return await creditTariffApi.create(data);
  },

  update: async (id: string, data: CreditTariffRequest) => {
    return await creditTariffApi.update(id, data);
  },

  delete: async (id: string) => {
    return await creditTariffApi.delete(id);
  },
};