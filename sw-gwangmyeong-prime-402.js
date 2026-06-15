const CACHE_NAME='gm402-db-sms-icon-v2';
const FILES=[
  '/checklist/gwangmyeong-prime-402.html',
  '/checklist/manifest-gwangmyeong-prime-402.json',
  '/checklist/icon-gwangmyeong-192.png',
  '/checklist/icon-gwangmyeong-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(FILES))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME)
          .then(c => c.put(e.request, copy))
          .catch(() => {});
        return r;
      })
      .catch(() =>
        caches.match(e.request)
          .then(c => c || caches.match('/checklist/gwangmyeong-prime-402.html'))
      )
  );
});
