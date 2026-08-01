// SW Mejorado - Actualización más agresiva
const CACHE_NAME = "clickgotaxi-v4"; // ← Cambia este número cada vez que subas cambios importantes
const urlsToCache = [
  "./",
  "./index.html",
  "./pedir_taxi.html",   // ← Agrega este si es tu archivo principal
  "./manifest.json"
];

// Instalar y activar inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar y limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Toma control inmediato de las pestañas
    })
  );
});

// Estrategia: Network First (prioriza internet sobre el caché)
self.addEventListener('fetch', event => {
  // Solo manejamos peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si la red responde bien, actualizamos el caché
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Si no hay internet, usamos el caché
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});

// Importar FCM
try {
  importScripts('./firebase-messaging-sw.js');
} catch (e) {
  console.log("FCM SW no cargado:", e);
}
