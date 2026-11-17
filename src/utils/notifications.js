import { authFetch } from "./auth";
import { API_URL } from "../config";


// ========================================
// Convert VAPID public key
// ========================================

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0)
    )
  );
}


// ========================================
// Register notification service worker
// ========================================

export async function registerNotificationServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error(
      "This browser does not support service workers."
    );
  }

  const registration =
    await navigator.serviceWorker.register(
      "/notification-sw.js"
    );

  return registration;
}


// ========================================
// Enable browser notifications
// ========================================

export async function enableBrowserNotifications(
  userId
) {
  if (!userId) {
    throw new Error(
      "Unable to identify the current user."
    );
  }

  if (!("Notification" in window)) {
    throw new Error(
      "This browser does not support notifications."
    );
  }

  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    throw new Error(
      "This browser does not support push notifications."
    );
  }


  // Ask browser for permission
  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Browser notification permission was not granted."
    );
  }


  // Register service worker
  const registration =
    await registerNotificationServiceWorker();


  // Get VAPID public key from backend
  const keyResponse = await fetch(
    `${API_URL}/notifications/public-key`
  );

  const keyData =
    await keyResponse.json();


  if (
    !keyResponse.ok ||
    !keyData.publicKey
  ) {
    throw new Error(
      keyData.message ||
        "Notification server public key is unavailable."
    );
  }


  // Check if browser already has a subscription
  let subscription =
    await registration.pushManager.getSubscription();


  // Create subscription if one does not exist
  if (!subscription) {
    subscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            keyData.publicKey
          ),
      });
  }


  // Save subscription in MongoDB
  const response = await authFetch(
    `${API_URL}/notifications/subscribe`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,

        subscription:
          subscription.toJSON(),
      }),
    }
  );


  const data =
    await response.json();


  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to register browser notifications."
    );
  }


  return data;
}


// ========================================
// Disable browser notifications
// ========================================

export async function disableBrowserNotifications(
  userId
) {
  if (
    !userId ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }


  const registration =
    await navigator.serviceWorker.getRegistration(
      "/"
    );


  if (!registration) {
    return;
  }


  const subscription =
    await registration.pushManager.getSubscription();


  if (!subscription) {
    return;
  }


  // Tell backend to disable subscription
 const response = await authFetch(
  `${API_URL}/notifications/unsubscribe`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      endpoint: subscription.endpoint,
    }),
  }
);

if (!response.ok) {
  const data = await response.json();
  throw new Error(
    data.message || "Failed to disable notifications."
  );
}


  // Remove browser subscription
  await subscription.unsubscribe();
}