// SW para PWABuilder - Actualización automática y caché offline
const CACHE_NAME = "clickgotaxi-v3"; // Sube el número cuando hagas cambios importantes en GitHub
const urlsToCache = ["./", "./index.html", "./manifest.json"];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    // Limpia las cachés viejas automáticamente al actualizar la versión
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Para la página principal (HTML), usa estrategia Network-First (Busca primero en la red para traer lo nuevo de GitHub)
    if (e.request.mode === 'navigate' || e.request.destination === 'document') {
        e.respondWith(
            fetch(e.request)
                .then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match(e.request) || caches.match('./index.html'))
        );
        return;
    }

    // Para el resto de archivos estáticos, usa caché con respaldo en red
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});

// Importar FCM si existe para notificaciones push en el AAB de PWABuilder
try {
    importScripts('./firebase-messaging-sw.js');
} catch(e) {
    console.log("FCM SW no cargado en sw.js, se usará firebase-messaging-sw.js separado");
}
