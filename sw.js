// sw.js - Versión Autorenovable
const CACHE_NAME = 'preety-cache-v' + Date.now(); // Nombre dinámico para forzar actualización

self.addEventListener('install', (event) => {
    // Fuerza al SW nuevo a tomar el control de inmediato
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Borra cachés viejos automáticamente
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Escuchador de notificaciones (Push)
self.addEventListener('push', (event) => {
    const options = {
        body: "¡NUEVO VIAJE DISPONIBLE! 🚕",
        icon: "https://cdn-icons-png.flaticon.com/512/71/71222.png",
        badge: "https://cdn-icons-png.flaticon.com/512/71/71222.png",
        vibrate: [500, 110, 500, 110, 450],
        tag: "alerta-taxi",
        renotify: true
    };
    event.waitUntil(self.registration.showNotification("🚕 PREETY TAXI", options));
});
