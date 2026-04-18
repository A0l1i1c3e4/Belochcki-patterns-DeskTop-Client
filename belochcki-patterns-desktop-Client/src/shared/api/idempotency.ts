type PendingIdempotentOperation = {
  fingerprint: string;
  idempotencyKey: string;
  createdAt: number;
};

const buildStorageKey = (scope: string) => `pending-idempotency:${scope}`;

function createUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateIdempotencyKey(scope: string, fingerprint: string): string {
    const storageKey = `idem_${scope}`
    const stored = localStorage.getItem(storageKey)
  
    if (stored) {
      const parsed = JSON.parse(stored)
  
      if (parsed.fingerprint === fingerprint) {
        console.log("[IDEMPOTENCY] REUSE KEY", {
          scope,
          key: parsed.key,
          fingerprint
        })
        return parsed.key
      }
    }
  
    const newKey = crypto.randomUUID()
  
    console.log("[IDEMPOTENCY] CREATE NEW KEY", {
      scope,
      key: newKey,
      fingerprint
    })
  
    localStorage.setItem(storageKey, JSON.stringify({
      key: newKey,
      fingerprint
    }))
  
    return newKey
  }
  
  export function clearIdempotencyKey(scope: string) {
    console.log("[IDEMPOTENCY] CLEAR KEY", { scope })
    localStorage.removeItem(`idem_${scope}`)
  }

export function shouldKeepIdempotencyKey(error: any): boolean {
  const status = error?.response?.status;

  if (!status) {
    return true;
  }

  return status >= 500;
}