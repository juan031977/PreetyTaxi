// Service Worker ClickGoTaxi - PWABuilder + Notificaciones
const CACHE_NAME = "clickgotaxi-v3";
const urlsToCache = ["./", "./index.html", "./manifest.json", "./panel_trabajo.html"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(() => caches.match("./index.html"))
  );
});

// Cargar FCM para notificaciones en segundo plano
try {
  importScripts('./firebase-messaging-sw.js');
} catch(e) {
  console.log("FCM SW no cargado:", e);
}
