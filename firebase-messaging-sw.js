// Firebase Messaging Service Worker - ClickGoTaxi
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD1c5lxn2ehGS_Wo5Htbkwi0gUcdpauiMg",
  databaseURL: "https://preetytaxiapp-default-rtdb.firebaseio.com",
  projectId: "preetytaxiapp",
  messagingSenderId: "1083536462057",
  appId: "1:1083536462057:web:1a2b3c4d5e6f"
});

const messaging = firebase.messaging();

// Notificaciones en SEGUNDO PLANO (app minimizada)
messaging.onBackgroundMessage(function(payload) {
  console.log('[FCM SW] Mensaje en segundo plano:', payload);

  const title = payload.notification?.title || payload.data?.title || "🚕 ¡Nuevo viaje disponible!";
  const body = payload.notification?.body || payload.data?.body || "Un pasajero está esperando. Toca para abrir.";

  const options = {
    body: body,
    icon: './icon-192.png',
    badge: './badge.png',
    vibrate: [300, 100, 300, 100, 300],
    sound: 'default',
    requireInteraction: true,  // No se cierra sola
    renotify: true,
    tag: 'viaje-nuevo',
    silent: false,
    data: {
      url: payload.data?.url || "./panel_trabajo.html",
      viajeId: payload.data?.viajeId || ""
    },
    actions: [
      { action: 'abrir', title: 'Abrir panel' },
      { action: 'cerrar', title: 'Cerrar' }
    ]
  };

  return self.registration.showNotification(title, options);
});

// Al tocar la notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'cerrar') return;

  const urlToOpen = event.notification.data?.url || "./panel_trabajo.html";

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes('panel_trabajo') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
