importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Configuración exacta de ClickGoTaxi
firebase.initializeApp({
  apiKey: "AIzaSyD1c5lxn2ehGS_Wo5Htbkwi0gUcdpauiMg",
  databaseURL: "https://preetytaxiapp-default-rtdb.firebaseio.com",
  projectId: "preetytaxiapp",
  messagingSenderId: "1083536462057",
  appId: "1:1083536462057:web:1a2b3c4d5e6f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[FCM SW] Mensaje recibido en segundo plano:', payload);
  
  const title = payload.notification?.title || payload.data?.title || "🚕 ¡Nuevo viaje disponible!";
  const body = payload.notification?.body || payload.data?.body || "Un pasajero está esperando";
  
  const options = {
    body: body,
    icon: '/icon-192.png', // Ruta absoluta para evitar que falle en segundo plano
    badge: '/badge.png',   // Ruta absoluta para evitar que falle en segundo plano
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true, 
    tag: 'viaje-nuevo', 
    renotify: true,
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || "./panel_trabajo.html",
      viajeId: payload.data?.viajeId || ""
    }
  };
  
  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  console.log('[FCM SW] Click en notificacion:', event);
  event.notification.close();
  
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
