// OneSignal 통합 Service Worker
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE = 'mento-chk-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(e.request).then(cached =>
          cached || fetch(e.request).then(r => {
            if(r.ok) c.put(e.request, r.clone());
            return r;
          })
        )
      ).catch(() => fetch(e.request))
    );
  }
});

self.addEventListener('message', e => {
  if(e.data?.type === 'SHOW_NOTIF'){
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: './icon-192.png',
      tag: 'mento-chk'
    });
  }
});
