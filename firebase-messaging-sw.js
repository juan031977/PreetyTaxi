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

// NOTIFICACIÓN EN SEGUNDO PLANO (Barras superior estilo WhatsApp)
messaging.onBackgroundMessage(function(payload) {
  console.log('[FCM SW] Mensaje recibido en segundo plano:', payload);
  
  const title = payload.notification?.title || payload.data?.title || "🚕 ¡Nuevo viaje disponible!";
  const body = payload.notification?.body || payload.data?.body || "Un pasajero está esperando";
  
  const options = {
    body: body,
    icon: '/PreetyTaxi/icon-192.png', // Ruta absoluta blindada
    badge: '/PreetyTaxi/badge.png',   // Silueta en la barra de estado de Android
    vibrate: [200, 100, 200, 100, 200],
    sound: 'default',
    requireInteraction: true, // Se queda fija hasta interactuar
    tag: 'viaje-nuevo',       // Reemplaza notificaciones acumuladas
    renotify: true,
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || "/PreetyTaxi/panel_trabajo.html",
      viajeId: payload.data?.viajeId || ""
    }
  };
  
  return self.registration.showNotification(title, options);
});

// CLIC EN LA NOTIFICACIÓN
self.addEventListener('notificationclick', function(event) {
  console.log('[FCM SW] Click en notificacion:', event);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "/PreetyTaxi/panel_trabajo.html";
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si el panel de trabajo ya está abierto en segundo plano, lo trae al frente
      for (let client of windowClients) {
        if (client.url.includes('panel_trabajo') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si la app estaba cerrada por completo, la abre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
