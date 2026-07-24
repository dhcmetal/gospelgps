/* GospelGPS service worker.
   Purpose: after the very first visit the whole app works with no signal at all —
   which matters when you're standing at somebody's door.

   IMPORTANT FOR FUTURE UPDATES: bump CACHE_VERSION whenever any app file changes,
   otherwise phones will keep showing the old cached version. */

const CACHE_VERSION = "gospelgps-v19";

const ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/data.js",
  "./js/store.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-256.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon-192-maskable.png",
  "./icons/icon-512-maskable.png"
];

/* Install: pre-cache everything so the first offline launch works. */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* Activate: throw away caches from older versions. */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Fetch strategy:
   - App code (the page itself + js/css/manifest): NETWORK-FIRST, so a republished
     update is picked up as soon as there's signal. Falls back to the cached copy
     when offline, so it still works at a door with no signal.
   - Static assets (icons/images): cache-first for instant, offline-safe loads —
     they don't change between versions. */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // never touch outside requests

  const isNavigate = req.mode === "navigate";
  const isCode = isNavigate || /\.(?:html|js|css|webmanifest)$/.test(url.pathname);
  const cacheKey = isNavigate ? "./index.html" : req;

  if (isCode) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(cacheKey, copy));
          }
          return res;
        })
        .catch(() => caches.match(cacheKey).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

