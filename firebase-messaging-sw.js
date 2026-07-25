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

// ESTO ES LO QUE HACE QUE SALGA ARRIBA A LA IZQ COMO WHATSAPP AUNQUE ESTÉS EN OTRA APP
messaging.onBackgroundMessage(function(payload) {
  console.log('[FCM SW] Mensaje recibido en segundo plano:', payload);
  
  const title = payload.notification?.title || payload.data?.title || "🚕 ¡Nuevo viaje disponible!";
  const body = payload.notification?.body || payload.data?.body || "Un pasajero está esperando";
  
  const options = {
    body: body,
    icon: './icon-192.png', // El icono cuadrado normal al centro
    badge: './badge.png',   // LA CLAVE: Tu silueta blanca en PNG transparente para la barra superior
    vibrate: [200, 100, 200, 100, 200],
    sound: 'default',
    requireInteraction: true, // Se queda arriba hasta que le den clic
    tag: 'viaje-nuevo', // Si llega otro viaje, reemplaza el anterior
    renotify: true,
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || "./panel_trabajo.html",
      viajeId: payload.data?.viajeId || ""
    }
  };
  
  return self.registration.showNotification(title, options);
});

// CUANDO LE DAS CLIC A LA NOTIFICACION ARRIBA A LA IZQ SE ENFOCA EL PANEL
self.addEventListener('notificationclick', function(event) {
  console.log('[FCM SW] Click en notificacion:', event);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "./panel_trabajo.html";
  
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
