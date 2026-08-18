const CACHE_NAME = "friend-bet-games-v42";
const CACHE_PREFIX = "friend-bet-games-";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=42",
  "./vendor/matter-js/matter.min.js?v=42",
  "./vendor/peerjs/peerjs.min.js?v=42",
  "./fruit-logic.js?v=42",
  "./stack-logic.js?v=42",
  "./engagement-logic.js?v=42",
  "./challenge-logic.js?v=42",
  "./online-activity-logic.js?v=42",
  "./online-room.js?v=42",
  "./result-share.js?v=42",
  "./pwa-manager.js?v=42",
  "./app.js?v=42",
  "./manifest.webmanifest?v=42",
  "./favicon.svg?v=42",
  "./icons/icon-192.png?v=42",
  "./icons/icon-512.png?v=42",
  "./icons/icon-maskable-512.png?v=42",
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
