// sw.js - Motor de Notificaciones PreetyTaxi
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// Abre la app cuando el chofer toca la notificación
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window' }).then((list) => {
            if (list.length > 0) return list[0].focus();
            return clients.openWindow('panel_trabajo.html');
        })
    );
});