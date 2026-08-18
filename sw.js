const CACHE_NAME = "friend-bet-games-v44";
const CACHE_PREFIX = "friend-bet-games-";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=44",
  "./vendor/matter-js/matter.min.js?v=44",
  "./vendor/peerjs/peerjs.min.js?v=44",
  "./vendor/qrcode-generator/qrcode.js?v=44",
  "./fruit-logic.js?v=44",
  "./stack-logic.js?v=44",
  "./engagement-logic.js?v=44",
  "./challenge-logic.js?v=44",
  "./online-activity-logic.js?v=44",
  "./online-session-logic.js?v=44",
  "./turn-config.js?v=44",
  "./online-room.js?v=44",
  "./result-share.js?v=44",
  "./pwa-manager.js?v=44",
  "./app.js?v=44",
  "./manifest.webmanifest?v=44",
  "./favicon.svg?v=44",
  "./icons/icon-192.png?v=44",
  "./icons/icon-512.png?v=44",
  "./icons/icon-maskable-512.png?v=44",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const requests = APP_FILES.map(
        (path) =>
          new Request(new URL(path, self.registration.scope), {
            cache: "reload",
          }),
      );
      await cache.addAll(requests);
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const outdatedKeys = keys.filter(
        (key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME,
      );
      await Promise.all(outdatedKeys.map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request, { cache: "no-store" });
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return Response.error();
      }
    })(),
  );
});
