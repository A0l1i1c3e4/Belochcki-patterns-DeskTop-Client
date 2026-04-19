type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

type CircuitStats = {
  success: number;
  failure: number;
  state: CircuitState;
  nextTry: number;
  halfOpenInProgress: boolean;
};

const STORAGE_KEY = "circuits_v1";

const FAILURE_THRESHOLD = 0.5;
const MIN_REQUESTS = 5;
const OPEN_TIMEOUT = 10000;

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
  if (!circuits[key]) {
    circuits[key] = {
      success: 0,
      failure: 0,
      state: "CLOSED",
      nextTry: 0,
      halfOpenInProgress: false,
    };
    saveCircuits();
  }
  return circuits[key];
}

export function canRequest(key: string): boolean {
  const circuit = getOrCreate(key);
  const now = Date.now();

  if (circuit.state === "OPEN") {
    if (now >= circuit.nextTry) {
      circuit.state = "HALF_OPEN";
      circuit.halfOpenInProgress = false;
      saveCircuits();
    } else {
      return false;
    }
  }

  if (circuit.state === "HALF_OPEN") {
    if (circuit.halfOpenInProgress) {
      return false;
    }
    circuit.halfOpenInProgress = true;
    saveCircuits();
    return true;
  }

  return true;
}

export function onSuccess(key: string): void {
  const circuit = getOrCreate(key);

  if (circuit.state === "HALF_OPEN") {
    resetCircuit(circuit);
    saveCircuits();
    return;
  }

  circuit.success++;
  saveCircuits();
}

export function onFailure(key: string): void {
  const circuit = getOrCreate(key);

  if (circuit.state === "HALF_OPEN") {
    openCircuit(circuit);
    saveCircuits();
    return;
  }

  circuit.failure++;

  const total = circuit.success + circuit.failure;

  if (total >= MIN_REQUESTS) {
    const errorRate = circuit.failure / total;

    if (errorRate >= FAILURE_THRESHOLD) {
      openCircuit(circuit);
      saveCircuits();
      return;
    }
  }

  saveCircuits();
}

function openCircuit(circuit: CircuitStats): void {
  circuit.state = "OPEN";
  circuit.nextTry = Date.now() + OPEN_TIMEOUT;
}

function resetCircuit(circuit: CircuitStats): void {
  circuit.state = "CLOSED";
  circuit.success = 0;
  circuit.failure = 0;
  circuit.halfOpenInProgress = false;
}

export function getCircuitState(key: string): CircuitState {
  return getOrCreate(key).state;
}