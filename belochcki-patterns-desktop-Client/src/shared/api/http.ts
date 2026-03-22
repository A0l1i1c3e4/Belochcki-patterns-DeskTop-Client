import axios  from "axios";
import type{ AxiosInstance } from "axios";

type CustomAxiosInstance = Omit<AxiosInstance, "get" | "post" | "put" | "delete" | "patch"> & {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
};

export const http = axios.create({
  baseURL: "http://localhost:8085/api",
}) as CustomAxiosInstance;

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(
      error.response?.data?.message || error.message
    );
  }
);