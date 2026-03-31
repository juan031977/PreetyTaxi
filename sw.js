// Service Worker para PreetyTaxi
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Cuando el chofer toca la barrita flotante
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Si el panel de trabajo ya está abierto, lo enfoca
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.includes('panel_trabajo.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Si no está abierto, lo abre
            if (clients.openWindow) {
                return clients.openWindow('./panel_trabajo.html');
            }
        })
    );
});
