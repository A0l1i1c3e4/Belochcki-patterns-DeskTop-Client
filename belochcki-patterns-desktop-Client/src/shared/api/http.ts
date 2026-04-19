import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { canRequest, onFailure, onSuccess } from "./CircutBreaker";

type CustomAxiosInstance = Omit<
  AxiosInstance,
  "get" | "post" | "put" | "delete" | "patch"
> & {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
};

export const http = axios.create({
  baseURL: "http://localhost:8085/api",
}) as CustomAxiosInstance;

function buildKey(config: AxiosRequestConfig): string {
  const method = (config.method || "GET").toUpperCase();
  const url = config.url || "";
  return `${method}:${url}`;
}

function isAuthRequest(url?: string): boolean {
  return url?.includes("/auth/login") ?? false;
}

//
// 🔥 REQUEST INTERCEPTOR
//
http.interceptors.request.use((config) => {
  const key = buildKey(config);

  // Circuit breaker check
  if (!canRequest(key)) {
    return Promise.reject({
      status: 503,
      message: "Service unavailable (circuit open)",
    });
  }

  // Token
  const token = localStorage.getItem("accessToken");

  if (token && !isAuthRequest(config.url)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // сохраняем key в config для response interceptor
  (config as any).__cbKey = key;

  return config;
});

//
// 🔥 RESPONSE INTERCEPTOR
//
http.interceptors.response.use(
  (response) => {
    const key = (response.config as any).__cbKey;

    if (key) {
      onSuccess(key);
    }

    return response.data;
  },
  (error) => {
    const config = error.config || {};
    const key = (config as any).__cbKey;

    if (key) {
      const status = error.response?.status;

      // считаем только 5xx как failure
      if (status >= 500 || !status) {
        onFailure(key);
      }
    }

    return Promise.reject(
      error.response?.data?.message || error.message
    );
  }
);