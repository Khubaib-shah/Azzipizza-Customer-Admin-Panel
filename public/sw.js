const CACHE_NAME = 'azzipizza-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', () => {
});

// 🔔 Push Notifications Handling
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error("[SW]: Failed to parse push data", e);
    return;
  }

  // FCM payloads can be nested under .notification or .data
  const title = data.notification?.title || data.title || "New Notification";
  const body = data.notification?.body || data.body || "You have a new update!";
  const payloadData = data.data || data || {};

  const options = {
    body: body,
    icon: "/Logo.jpg",
    badge: "/Logo.jpg",
    data: payloadData,
    vibrate: [200, 100, 200],
    tag: 'new-order',
    renotify: true
  };

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const isAppActive = clientList.some((client) => client.visibilityState === 'visible');

      if (!isAppActive) {
        return self.registration.showNotification(title, options);
      }
      console.log("[SW]: App is active, skipping push notification (Socket.IO will handle it)");
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const orderId = event.notification.data?.orderId;
  const urlToOpen = orderId ? `/orders/${orderId}` : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
