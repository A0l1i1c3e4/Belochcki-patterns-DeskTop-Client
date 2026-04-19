type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

type CircuitStats = {
  success: number;
  failure: number;
  state: CircuitState;
  windowStart: number;
  nextTry: number;
};

const STORAGE_KEY = "circuits_v3";

const WINDOW_MS = 60_000;
const FAILURE_THRESHOLD = 0.7;
const OPEN_TIMEOUT = 10_000;

function loadCircuits(): Record<string, CircuitStats> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const circuits: Record<string, CircuitStats> = loadCircuits();

function saveCircuits(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
  } catch {}
}

function getOrCreate(key: string): CircuitStats {
  const now = Date.now();

  if (!circuits[key]) {
    circuits[key] = {
      success: 0,
      failure: 0,
      state: "CLOSED",
      windowStart: now,
      nextTry: 0,
    };
    saveCircuits();
  }

  const circuit = circuits[key];

  // OPEN state check
  if (circuit.state === "OPEN") {
    if (now >= circuit.nextTry) {
      circuit.state = "HALF_OPEN";
      circuit.success = 0;
      circuit.failure = 0;
      circuit.windowStart = now;
    } else {
      saveCircuits();
      return circuit;
    }
  }

  // window evaluation (1 minute bucket)
  if (now - circuit.windowStart >= WINDOW_MS) {
    evaluateAndReset(circuit);
  }

  saveCircuits();
  return circuit;
}

export function canRequest(key: string): boolean {
  const circuit = getOrCreate(key);

  if (circuit.state === "OPEN") {
    return false;
  }

  if (circuit.state === "HALF_OPEN") {
    return true;
  }

  return true;
}

export function onSuccess(key: string): void {
  const circuit = getOrCreate(key);

  if (circuit.state === "OPEN") return;

  circuit.success++;
  saveCircuits();
}

export function onFailure(key: string): void {
  const circuit = getOrCreate(key);

  if (circuit.state === "OPEN") return;

  circuit.failure++;
  saveCircuits();
}

function evaluateAndReset(circuit: CircuitStats): void {
  const total = circuit.success + circuit.failure;

  if (total > 0) {
    const errorRate = circuit.failure / total;

    if (errorRate >= FAILURE_THRESHOLD) {
      circuit.state = "OPEN";
      circuit.nextTry = Date.now() + OPEN_TIMEOUT;
    } else {
      circuit.state = "CLOSED";
    }
  } else {
    circuit.state = "CLOSED";
  }

  circuit.success = 0;
  circuit.failure = 0;
  circuit.windowStart = Date.now();
}

export function getCircuitState(key: string): CircuitState {
  return getOrCreate(key).state;
}