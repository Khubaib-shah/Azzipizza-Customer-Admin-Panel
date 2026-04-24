const CACHE_NAME = 'azzipizza-v1';

// Install — just activate immediately, no precaching
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate — clean old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network only, let the browser handle everything normally.
// The SW exists solely to satisfy PWA installability requirements.
// We intentionally do NOT intercept or cache any requests to avoid
// breaking dynamic content, API calls, audio playback, etc.
self.addEventListener('fetch', () => {
  // no-op: let the default browser fetch handle it
});
