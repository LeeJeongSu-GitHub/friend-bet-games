const CACHE_NAME = "friend-bet-games-v35";
const CACHE_PREFIX = "friend-bet-games-";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=35",
  "./vendor/matter-js/matter.min.js?v=35",
  "./fruit-logic.js?v=35",
  "./stack-logic.js?v=35",
  "./engagement-logic.js?v=35",
  "./challenge-logic.js?v=35",
  "./result-share.js?v=35",
  "./pwa-manager.js?v=35",
  "./app.js?v=35",
  "./manifest.webmanifest?v=35",
  "./favicon.svg?v=35",
  "./icons/icon-192.png?v=35",
  "./icons/icon-512.png?v=35",
  "./icons/icon-maskable-512.png?v=35",
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
