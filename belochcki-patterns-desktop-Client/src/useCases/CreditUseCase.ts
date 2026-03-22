import { creditApi } from "../shared/api/CreditApi";

export const creditUseCase = {
  getCredits: async () => {
    const res = await creditApi.getAll();
    return res.data ?? [];
  },

  getById: async (id: string) => {
    return await creditApi.getById(id);
  },

  getCreditRating: async (clientId: string) => {
    return await creditApi.getCreditRating(clientId);
  },

  getOperations: async (creditId: string) => {
    const res = await creditApi.getOperations(creditId);
    console.log(res);
    return res.data ?? [];
  },

  getDebts: async (clientId: string) => {
    return await creditApi.getDebts(clientId);
  },
};