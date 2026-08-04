// ============================================
// Click & Go Taxi - Service Worker unificado
// Caché PWA + FCM (segundo plano) + click notificación
// ============================================
const CACHE_NAME = "clickgotaxi-v7";

const urlsToCache = [
  "./",
  "./index.html",
  "./pedir_taxi.html",
  "./panel_trabajo.html",
  "./login_pasajero.html",
  "./login_conductor.html",
  "./registro_pasajero.html",
  "./registro_conductor.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./badge.png"
];

// Dominios que NUNCA se cachean (Firebase, Maps, CDNs dinámicos)
function noCachear(url) {
  const u = url.toString();
  return (
    u.includes("firebaseio.com") ||
    u.includes("googleapis.com") ||
    u.includes("gstatic.com") ||
    u.includes("google.com/maps") ||
    u.includes("firebasestorage.googleapis.com") ||
    u.includes("fcm.googleapis.com") ||
    u.includes("chrome-extension://")
  );
}

// ---------- INSTALAR ----------
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log("[SW] Algunos archivos no se cachearon:", err);
      });
    })
  );
});

// ---------- ACTIVAR (limpia cachés viejas) ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[SW] Eliminando caché antigua:", name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ---------- FETCH: Network First (HTML actualizado) ----------
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = event.request.url;

  // No interceptar APIs en vivo
  if (noCachear(url)) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Solo cachear respuestas OK del mismo origen
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("./index.html");
        });
      })
  );
});

// ---------- FCM (notificaciones en segundo plano) ----------
try {
  importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
  importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

  firebase.initializeApp({
    apiKey: "AIzaSyD1c5lxn2ehGS_Wo5Htbkwi0gUcdpauiMg",
    databaseURL: "https://preetytaxiapp-default-rtdb.firebaseio.com",
    projectId: "preetytaxiapp",
    messagingSenderId: "1083536462057",
    appId: "1:1083536462057:web:1a2b3c4d5e6f"
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    console.log("[SW] FCM segundo plano:", payload);

    const title =
      (payload.notification && payload.notification.title) ||
      (payload.data && payload.data.title) ||
      "🚕 ¡Nuevo viaje disponible!";

    const body =
      (payload.notification && payload.notification.body) ||
      (payload.data && payload.data.body) ||
      "Un pasajero está esperando";

    const options = {
      body: body,
      icon: "./icon-192.png",
      badge: "./badge.png",
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      tag: "viaje-nuevo",
      renotify: true,
      data: {
        url:
          (payload.data && payload.data.url) ||
          "./panel_trabajo.html",
        viajeId: (payload.data && payload.data.viajeId) || ""
      }
    };

    return self.registration.showNotification(title, options);
  });
} catch (e) {
  console.log("[SW] FCM no se pudo cargar:", e);
}

// ---------- CLIC EN LA NOTIFICACIÓN ----------
self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Click notificación:", event);
  event.notification.close();

  const urlToOpen =
    (event.notification.data && event.notification.data.url) ||
    "./panel_trabajo.html";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.indexOf("panel_trabajo") !== -1 && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
