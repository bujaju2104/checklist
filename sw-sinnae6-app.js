const CACHE_NAME='sinnae6-title-final-v1';
const ASSETS=['./sinnae6-app.html?v=title-final','./manifest-sinnae6-app.json','./icon-sinnae6-app-192.png','./icon-sinnae6-app-512.png','./apple-touch-icon-sinnae6-app.png','./og-sinnae6-logo-only.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sinnae6-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
