const CACHE_NAME='sinnae6-separate-app-v1';
const ASSETS=[
  './sinnae6-app.html?v=separate-app',
  './manifest-sinnae6-app.json',
  './icon-sinnae6-app-192.png',
  './icon-sinnae6-app-512.png',
  './apple-touch-icon-sinnae6-app.png',
  './og-sinnae6-app.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('sinnae6-') && k !== CACHE_NAME)
        .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
