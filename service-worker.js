self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("catch-n-track-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js",
        "/manifest.json",
        "https://cdn.jsdelivr.net/npm/dexie@4.0.2/dist/dexie.min.js"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});