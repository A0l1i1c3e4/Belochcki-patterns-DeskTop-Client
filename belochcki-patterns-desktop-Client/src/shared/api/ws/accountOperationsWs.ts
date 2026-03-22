import { Client } from "@stomp/stompjs";

type AccountOperationsInvalidationEvent = {
  type: "ACCOUNT_OPERATIONS_INVALIDATED";
  accountId: string;
};

type ConnectAccountOperationsWsParams = {
  accountId: string;
  onInvalidated: (event: AccountOperationsInvalidationEvent) => void;
  onConnect?: () => void;
  onError?: (message: string) => void;
};

export const connectAccountOperationsWs = ({
  accountId,
  onInvalidated,
  onConnect,
  onError,
}: ConnectAccountOperationsWsParams): (() => void) => {
  const client = new Client({
    brokerURL: "ws://localhost:8081/ws",
    reconnectDelay: 5000,
    debug: () => {},
  });

  client.onConnect = () => {
    onConnect?.();

    client.subscribe(`/topic/accounts/${accountId}/operations`, (message) => {
      try {
        const event: AccountOperationsInvalidationEvent = JSON.parse(message.body);
        onInvalidated(event);
      } catch {
        onError?.("Не удалось распарсить websocket-сообщение");
      }
    });
  };

  client.onStompError = (frame) => {
    onError?.(frame.headers["message"] || "STOMP error");
  };

  client.onWebSocketError = () => {
    onError?.("WebSocket connection error");
  };

  client.activate();

  return () => {
    client.deactivate();
  };
};