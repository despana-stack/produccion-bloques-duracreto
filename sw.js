// Service worker: permite instalar la app y abrirla rápido. Nunca guarda datos de producción.
const CACHE = 'produccion-bloques-v8';
const APP = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/icon-maskable-192.png', 'icons/icon-maskable-512.png', 'icons/favicon-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || /script\.google(usercontent)?\.com$/.test(u.hostname) || u.hostname.endsWith('googleusercontent.com')) return; // API: siempre en línea
  if (u.origin === location.origin) {
    // Archivos de la app: primero la red (para recibir actualizaciones), si no hay internet, la copia guardada
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  } else {
    // Librerías y tipografía: primero la copia guardada
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res; })));
  }
});

// Notificaciones push (Firebase Cloud Messaging, mensajes de datos)
self.addEventListener('push', e => {
  let d = {};
  try { const j = e.data ? e.data.json() : {}; d = j.data || j.notification || j; } catch (err) { d = { body: e.data ? e.data.text() : '' }; }
  const title = d.title || 'Duracreto 360';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || 'Hay un aviso nuevo.', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
    tag: d.tag === 'prueba' ? 'prueba' : d.tag === 'corte' ? 'corte' : 'paro-' + Date.now(), renotify: true, requireInteraction: d.tag !== 'prueba' && d.tag !== 'corte',
    vibrate: [300, 120, 300, 120, 300], data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.startsWith(self.registration.scope)) return w.focus().then(x => x && x.navigate ? x.navigate(url) : x);
    return clients.openWindow(url);
  }));
});
