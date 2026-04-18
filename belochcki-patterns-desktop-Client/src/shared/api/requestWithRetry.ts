import axios, { AxiosError } from "axios";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableStatus = (status?: number) => {
  return status === 500 || status === 502 || status === 503;
};

const isRetryableError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  if (!status) {
    return true;
  }

  return isRetryableStatus(status);
};

type RequestWithRetryOptions<T> = {
  request: () => Promise<T>;
  operationName: string;
  idempotencyKey?: string;
  maxAttempts?: number;
};

export async function requestWithRetry<T>({
  request,
  operationName,
  idempotencyKey,
  maxAttempts = 2,
}: RequestWithRetryOptions<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log("[WEB RETRY] attempt", {
        operationName,
        attempt,
        maxAttempts,
        idempotencyKey,
      });

      const result = await request();

      console.log("[WEB RETRY] success", {
        operationName,
        attempt,
        idempotencyKey,
      });

      return result;
    } catch (error) {
      lastError = error;

      const status = axios.isAxiosError(error) ? error.response?.status : undefined;

      console.log("[WEB RETRY] error", {
        operationName,
        attempt,
        maxAttempts,
        idempotencyKey,
        status,
        message: axios.isAxiosError(error) ? error.message : String(error),
      });

      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw error;
      }

      const delay = attempt === 1 ? 400 : 800;
      await sleep(delay);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unknown retry error");
}