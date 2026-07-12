// Evidentum Pro service worker
// Strategy: NETWORK-FIRST, and ONLY for SAME-ORIGIN app assets — online users
// always get the latest build; the cache is only an offline fallback. Cross-origin
// requests (scholarly-database + AI-provider APIs, CORS proxies, the pdf.js CDN)
// are never intercepted or cached, so search terms, query URLs and credential-
// bearing URLs (e.g. NCBI ?api_key=…) never persist in the Cache API and the cache
// can't grow unbounded with opaque cross-origin responses. The SW only manages the
// Cache API — it never touches IndexedDB or localStorage, so an update can't clear
// projects, appraisals or credentials.
// v5: scoped caching to same-origin (was catch-all); bump evicts the old cache,
// which may have held cross-origin API/credential-bearing responses.
const CACHE = 'evidentum-v5';
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

  // CROSS-ORIGIN → do not intercept: the browser handles it over the network and
  // nothing is written to the Cache API. This deliberately excludes every API,
  // proxy, CDN and credential-bearing request (search URLs, NCBI ?api_key=…, AI
  // provider calls, fetched PDFs from external hosts).
  let sameOrigin = false;
  try { sameOrigin = new URL(req.url).origin === self.location.origin; } catch (err) { sameOrigin = false; }
  if (!sameOrigin) return;

  // Same-origin app shell only: network-first (freshest build wins online), cache
  // as an offline fallback. Navigations fall back to the cached index.html offline.
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});   // ignore quota/opaque put failures
        return res;
      })
      .catch(() =>
        caches.match(req).then((r) =>
          r || ((req.mode === 'navigate' || req.destination === 'document') ? caches.match('./index.html') : undefined)
        )
      )
  );
});
