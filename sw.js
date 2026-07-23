// SW para PWABuilder - cache offline
const CACHE_NAME = "clickgotaxi-v2";
const urlsToCache = ["./", "./index.html", "./manifest.json"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(()=> caches.match("./index.html"))
  );
});

// Importar FCM si existe - esto permite que el AAB de PWABuilder tambien muestre notificaciones
try {
  importScripts('./firebase-messaging-sw.js');
} catch(e) {
  console.log("FCM SW no cargado en sw.js, se usara firebase-messaging-sw.js separado");
}
