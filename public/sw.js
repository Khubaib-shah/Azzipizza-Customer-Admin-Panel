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

  const data = event.data.json();
  const options = {
    body: data.body || "You have a new update!",
    icon: "/icon.png",
    badge: "/icon.png",
    data: data.data || {},
    vibrate: [200, 100, 200],
    tag: 'new-order', // Prevents multiple notifications for the same thing
    renotify: true
  };

  // UX Rule: Only show push notification if the app is NOT active
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const isAppActive = clientList.some((client) => client.visibilityState === 'visible');
      
      if (!isAppActive) {
        return self.registration.showNotification(data.title || "New Notification", options);
      }
      console.log("[SW]: App is active, skipping push notification (Socket.IO will handle it)");
    })
  );
});

// 🖱️ Notification Click Handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const orderId = event.notification.data?.orderId;
  const urlToOpen = orderId ? `/orders/${orderId}` : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
