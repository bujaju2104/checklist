const CACHE_NAME = 'sangye2-pwa-v11';

const APP_SHELL = [
'/checklist/sangye2-choigwan.html',
'/checklist/manifest-sangye2.json',
'/checklist/icon-192.png',
'/checklist/icon-512.png'
];

self.addEventListener('install', function(event) {
event.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
return cache.addAll(APP_SHELL);
}).catch(function() {
return null;
})
);
self.skipWaiting();
});

self.addEventListener('activate', function(event) {
event.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(
keys.filter(function(key) {
return key !== CACHE_NAME;
}).map(function(key) {
return caches.delete(key);
})
);
})
);
self.clients.claim();
});

self.addEventListener('fetch', function(event) {
if (event.request.method !== 'GET') {
return;
}

event.respondWith(
fetch(event.request).then(function(response) {
const copy = response.clone();

  caches.open(CACHE_NAME).then(function(cache) {
      cache.put(event.request, copy);
        }).catch(function() {
            return null;
              });

                return response;
                }).catch(function() {
                  return caches.match(event.request).then(function(cached) {
                      return cached || caches.match('/checklist/sangye2-choigwan.html');
                        });
                        })

                        );
                        });

                        self.addEventListener('push', function(event) {
                        let data = {};

                        try {
                        data = event.data ? event.data.json() : {};
                        } catch (e) {
                        data = {
                        title: '상계2구역 체크리스트',
                        body: event.data ? event.data.text() : '새 알림이 있습니다.'
                        };
                        }

                        const title = data.title || '상계2구역 체크리스트';

                        const options = {
                        body: data.body || '체크리스트 알림이 도착했습니다.',
                        icon: '/checklist/icon-192.png',
                        badge: '/checklist/icon-192.png',
                        data: {
                        url: data.url || '/checklist/sangye2-choigwan.html'
                        },
                        vibrate: [120, 60, 120]
                        };

                        event.waitUntil(
                        self.registration.showNotification(title, options)
                        );
                        });

                        self.addEventListener('notificationclick', function(event) {
                        event.notification.close();

                        const url = event.notification.data && event.notification.data.url
                        ? event.notification.data.url
                        : '/checklist/sangye2-choigwan.html';

                        event.waitUntil(
                        clients.matchAll({
                        type: 'window',
                        includeUncontrolled: true
                        }).then(function(clientList) {
                        for (const client of clientList) {
                        if (client.url.includes('/checklist/') && 'focus' in client) {
                        client.focus();

                              if ('navigate' in client) {
                                      client.navigate(url);
                                            }

                                                  return;
                                                      }
                                                        }

                                                          if (clients.openWindow) {
                                                              return clients.openWindow(url);
                                                                }
                                                                })

                                                                );
                                                                });