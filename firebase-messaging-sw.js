importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD1c5lxn2ehGS_Wo5Htbkwi0gUcdpauiMg",
  databaseURL: "https://preetytaxiapp-default-rtdb.firebaseio.com",
  projectId: "preetytaxiapp",
  messagingSenderId: "1083536462057",
  appId: "1:1083536462057:web:demo"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Notificación recibida', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://firebasestorage.googleapis.com/v0/b/preetytaxiapp.firebasestorage.app/o/taxi%20banner.jpg?alt=media&token=7433caf7-edf1-4fa3-b413-083f5066f90d',
    badge: 'https://firebasestorage.googleapis.com/v0/b/preetytaxiapp.firebasestorage.app/o/taxi%20banner.jpg?alt=media',
    vibrate: [200, 100, 200]
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
