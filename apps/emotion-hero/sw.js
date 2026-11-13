const CACHE_NAME = "emotion-hero-v1.0.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/dashboard.css",
  "./css/gameplay.css",
  "./css/animations.css",
  "./css/responsive.css",
  "./js/app.js",
  "./js/router.js",
  "./js/data/levels.js",
  "./js/data/missions.js",
  "./js/data/age-modes.js",
  "./js/engine/game-engine.js",
  "./js/engine/scoring.js",
  "./js/engine/level-manager.js",
  "./js/components/audio-manager.js",
  "./js/components/toast.js",
  "./js/screens/age-selection.js",
  "./js/screens/dashboard.js",
  "./js/screens/gameplay.js",
  "./js/screens/result.js",
  "./js/screens/settings.js",
  "./js/storage/progress-store.js",
  "./js/storage/settings-store.js",
  "./js/utils/shuffle.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match("./index.html")) || caches.match("./offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
