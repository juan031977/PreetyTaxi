// Service Worker para Notificaciones Push - Click&GoTaxi
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD1c5lxn2ehGS_Wo5Htbkwi0gUcdpauiMg",
  authDomain: "preetytaxiapp.firebaseapp.com",
  databaseURL: "https://preetytaxiapp-default-rtdb.firebaseio.com",
  projectId: "preetytaxiapp",
  storageBucket: "preetytaxiapp.firebasestorage.app",
  messagingSenderId: "1083536462057",
  appId: "1:1083536462057:web:abcdef"
});

const messaging = firebase.messaging();

// Manejar alertas cuando la app está cerrada o en segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || '¡Nuevo Viaje Disponible!';
  const notificationOptions = {
    body: payload.notification?.body || 'Un pasajero ha solicitado un servicio.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [300, 100, 300, 100, 300]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Acción al hacer clic en la notificación para abrir la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
