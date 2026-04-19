import axios from "axios";
import { canRequest, onFailure, onSuccess } from "./CircutBreaker";

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = resolveUrl(input);
  const method = init?.method || "GET";

  const key = `${method}:${url}`;

  if (!canRequest(key)) {
    return Promise.reject({
      status: 503,
      message: "Circuit OPEN",
    });
  }

  try {
    const response = await originalFetch(input, init);

    if (response.ok) {
      onSuccess(key);
    } else if (response.status >= 500) {
      onFailure(key);
    }

    return response;
  } catch (e) {
    onFailure(key);
    throw e;
  }
};


axios.interceptors.request.use((config) => {
  const method = (config.method || "GET").toUpperCase();
  const url = config.url || "";

  const key = `${method}:${url}`;

  (config as any).__cbKey = key;

  if (!canRequest(key)) {
    return Promise.reject({
      status: 503,
      message: "Circuit OPEN",
    });
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    const key = (response.config as any).__cbKey;
    if (key) onSuccess(key);
    return response;
  },
  (error) => {
    const key = error.config?.__cbKey;

    if (key) {
      const status = error.response?.status;
      if (!status || status >= 500) {
        onFailure(key);
      }
    }

    return Promise.reject(error);
  }
);