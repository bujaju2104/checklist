// ════════════════════════════════════════
// 문멘토 체크리스트 · Service Worker
// sw.js — checklist 폴더 안에 저장
// ════════════════════════════════════════

const CACHE = 'mento-chk-v1';

// 설치 즉시 활성화
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// 오프라인 캐시 (선택 사항)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(e.request).then(cached =>
          cached || fetch(e.request).then(r => {
            if (r.ok) c.put(e.request, r.clone());
            return r;
          })
        )
      ).catch(() => fetch(e.request))
    );
  }
});

// ── 메인 스레드로부터 알림 요청 수신 ──
// 페이지가 백그라운드/최소화 상태에서도 알림 표시됨
self.addEventListener('message', e => {
  if (e.data?.type === 'SHOW_NOTIF') {
    self.registration.showNotification(e.data.title, {
      body:  e.data.body,
      icon:  './icon-192.png',
      badge: './icon-192.png',
      tag:   'mento-chk',          // 같은 태그면 이전 알림 덮어씀
      data:  { url: e.data.url || './' }
    });
  }
});

// ── Web Push 수신 (향후 서버 푸시 대응) ──
self.addEventListener('push', e => {
  const d = e.data?.json() || { title: '문멘토 체크리스트', body: '항목이 업데이트됐어요!' };
  e.waitUntil(
    self.registration.showNotification(d.title, {
      body:  d.body,
      icon:  './icon-192.png',
      badge: './icon-192.png',
      tag:   'mento-chk',
      data:  { url: './' }
    })
  );
});

// ── 알림 탭 → 앱 열기 ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = e.notification.data?.url || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      const open = wins.find(w => w.url.includes('checklist'));
      return open ? open.focus() : clients.openWindow(target);
    })
  );
});
