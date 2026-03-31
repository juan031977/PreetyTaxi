// sw.js - El Vigilante de PreetyTaxi
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

// ESTO ES LO QUE HACE QUE EL CELULAR "DESPIERTE"
self.addEventListener('push', (e) => {
    const options = {
        body: "🚕 ¡NUEVO VIAJE DISPONIBLE! - Toca para ver",
        icon: "https://cdn-icons-png.flaticon.com/512/71/71222.png",
        badge: "https://cdn-icons-png.flaticon.com/512/71/71222.png", // El icono de arriba
        vibrate: [500, 100, 500, 100, 500],
        tag: "alerta-viaje",
        renotify: true,
        requireInteraction: true, // No se quita hasta que la toques
        data: { url: 'panel_trabajo.html' }
    };

    e.waitUntil(
        self.registration.showNotification("🚕 PREETY TAXI", options)
    );
});

// Al tocar la notificación te lleva al panel
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        clients.openWindow('panel_trabajo.html')
    );
});
