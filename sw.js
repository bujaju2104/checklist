// 문멘토 체크리스트 Service Worker v1.0
const CACHE_NAME = 'munmento-v1';
const URLS_TO_CACHE = ['./index.html', './icon-192.png', './manifest.json'];

// 설치
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// 활성화
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선, 캐시 백업
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// ── 백그라운드 푸시 알림 ──
self.addEventListener('push', e => {
  let data = { title: '문멘토 체크리스트', body: '새로운 업데이트가 있어요!' };
  try { data = e.data.json(); } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title || '문멘토 체크리스트', {
      body: data.body || '체크리스트를 확인해주세요',
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || './' },
      actions: [{ action: 'open', title: '열기' }]
    })
  );
});

// 알림 클릭
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('checklist') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});

// OneSignal과 함께 작동
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
