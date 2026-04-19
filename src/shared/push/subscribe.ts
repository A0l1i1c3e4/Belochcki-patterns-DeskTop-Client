const publicKey = "BEiA_n8BZKZ6Tt_C13sbpMwsr93IHW8M1svVjpos73Y0ycm_fbXZK7byS6Y6DxKdw5CKzfjgnuXh1b9h7CttYss";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export async function subscribeUser(userId: number) {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const body = {
    endpoint: subscription.endpoint,
    p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!))),
    auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!))),
    userId,
  };

  await fetch("http://localhost:8083/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Internal-Call": "true" },
    body: JSON.stringify(body),
  });
}