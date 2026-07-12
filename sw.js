// Evidentum Pro service worker
// Strategy: NETWORK-FIRST for everything — online users always get the latest
// build; the cache is only an offline fallback. Because nothing is served from
// cache while the network is reachable, a stale asset can never ship, so the
// CACHE version below is non-critical (bumping it just evicts the old offline
// copy). The SW only manages the Cache API — it never touches IndexedDB or
// localStorage, so an update can't clear projects, appraisals or credentials.
const CACHE = 'evidentum-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Network-first for EVERYTHING (page, manifest, icons): the freshest response
  // always wins online; we refresh the cache copy as we go. The cache is used
  // only when the network fails — a true offline fallback, never a stale-while-
  // online source. Navigations fall back to the cached index.html when offline.
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req).then((r) =>
          r || ((req.mode === 'navigate' || req.destination === 'document') ? caches.match('./index.html') : undefined)
        )
      )
  );
});
