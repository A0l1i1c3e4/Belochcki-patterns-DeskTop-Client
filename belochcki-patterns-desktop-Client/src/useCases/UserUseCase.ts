import { userApi } from "../shared/api/userApi";
import type { Client, Employee, User } from "../types/User";

export const userUseCase = {
  getUsers: async (
    type: "clients" | "employees"
  ): Promise<User[]> => {
    return type === "clients"
      ? await userApi.getClients()
      : await userApi.getEmployees();
  },

  getUserById: async (
    type: "clients" | "employees",
    id: string
  ): Promise<User> => {
    return type === "clients"
      ? await userApi.getClientById(id)
      : await userApi.getEmployeeById(id);
  },

  createUser: async (
    type: "clients" | "employees",
    data: Partial<User>
  ): Promise<Client | Employee> => {
    return type === "clients"
      ? await userApi.createClient(data as Client)
      : await userApi.createEmployee(data as Employee);
  },

  updateUser: async (
    type: "clients" | "employees",
    id: string,
    data: Partial<User>
  ): Promise<Client | Employee> => {
    return type === "clients"
      ? await userApi.updateClient(id, data as Client)
      : await userApi.updateEmployee(id, data as Employee);
  },

  deleteUser: async (
    type: "clients" | "employees",
    id: string
  ): Promise<void> => {
    return type === "clients"
      ? await userApi.deleteClient(id)
      : await userApi.deleteEmployee(id);
  },

  toggleLock: async (
    type: "clients" | "employees",
    id: string,
    status: string
  ) => {
    if (type === "clients") {
      return status === "UNLOCKED"
        ? await userApi.lockClient(id)
        : await userApi.unlockClient(id);
    } else {
      return status === "UNLOCKED"
        ? await userApi.lockEmployee(id)
        : await userApi.unlockEmployee(id);
    }
  },
};