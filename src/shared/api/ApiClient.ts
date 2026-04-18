import { canRequest, onFailure, onSuccess } from "../api/CircutBreaker";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
};

function buildKey(method: HttpMethod, url: string): string {
  return `${method}:${url}`;
}

export async function apiRequest<T = any>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const method: HttpMethod = options.method || "GET";
  const url = `${baseUrl}${path}`;
  const key = buildKey(method, url);

  if (!canRequest(key)) {
    return Promise.reject({
      status: 503,
      message: "Service unavailable (circuit open)",
    });
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await safeParse(response);

      const shouldCountFailure = response.status >= 500;

      if (shouldCountFailure) {
        onFailure(key);
      }

      return Promise.reject({
        status: response.status,
        data: error,
      });
    }

    const data = await safeParse(response);

    onSuccess(key);

    return data as T;
  } catch (error) {
    onFailure(key);

    return Promise.reject({
      status: 0,
      message: "Network error",
      error,
    });
  }
}

async function safeParse(response: Response): Promise<any> {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}