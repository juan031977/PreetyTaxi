// SW Mejorado: Limpieza forzada de caché y notificaciones
const CACHE_NAME = "clickgotaxi-v3"; // Subimos la versión para forzar el cambio
const urlsToCache = ["./", "./index.html", "./manifest.json"];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
  );
  self.skipWaiting(); // Fuerza a activar este SW de inmediato
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Borra cualquier caché viejita (como la v2 o anteriores) para que no se quede "casado"
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Borrando caché vieja:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim(); // Toma el control de las pestañas abiertas al instante
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(() => caches.match("./index.html"))
  );
});

// Importar FCM para que las notificaciones suenen con la pantalla apagada
try {
  importScripts('./firebase-messaging-sw.js');
} catch(e) {
  console.log("FCM SW cargado de forma separada o falló el import:", e);
}
