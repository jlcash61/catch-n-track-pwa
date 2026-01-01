const CACHE_NAME = "catchntrack-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/js/app.js",
  "/js/db.js",
  "/js/geo.js",
  "/js/map.js",
  "/js/modes.js",
  "/js/export.js",
  "/js/import.js",
  "/js/weather.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"  
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
