const CACHE_NAME = 'sangye2-checklist-v2';

const APP_FILES = [
  '/checklist/sangye2-choigwan.html',
  '/checklist/manifest-sangye2.json',
  '/checklist/icon-192.png',
  '/checklist/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cachedResponse) =>
        cachedResponse || caches.match('/checklist/sangye2-choigwan.html')
      )
    )
  );
});
