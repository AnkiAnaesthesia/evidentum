// Evidentum Pro service worker
// Strategy: NETWORK-FIRST, and the Cache API holds ONLY the same-origin offline
// app shell — online users always get the latest build; the cache is just an
// offline fallback. Cross-origin requests (scholarly-database + AI-provider APIs,
// CORS proxies, the pdf.js CDN) are never intercepted, so search terms, query URLs
// and credential-bearing URLs (e.g. NCBI ?api_key=…) never reach the Cache API.
// The SW only manages the Cache API — it never touches IndexedDB or localStorage,
// so an update can't clear projects, appraisals or credentials.
// v6 (P6): writes are now restricted to a strict app-shell allowlist via
// swCacheableShell() — same-origin, GET, NO query string (so an OAuth callback
// ?code=…&state=… or any other query-bearing/sensitive same-origin URL is never
// persisted), 200 basic responses only. Bump evicts any v5 entry that a previous
// catch-all put may have stored.
const CACHE = 'evidentum-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// Pure decision: may this fetched response be written to the Cache API? The cache
// is STRICTLY the offline app shell — same-origin, a successful 200 basic (not
// opaque/cors/redirect) response, no query string, and a path on the allowlist
// (deploy root / index.html, the manifest, the icons, and the vendored pdf.js so
// offline appraisal keeps working). Everything else is served from the network and
// never stored — in particular any query-bearing URL, which is how OAuth callbacks
// (code/state) and other sensitive same-origin URLs would otherwise leak into the
// cache. Exported implicitly for the test harness (function declaration).
function swCacheableShell(reqUrl, res, selfOrigin) {
  if (!res || res.status !== 200 || res.ok !== true) return false;   // 2xx only
  if (res.type && res.type !== 'basic') return false;                // no opaque/cors/redirect
  let u;
  try { u = new URL(reqUrl); } catch (e) { return false; }
  if (u.origin !== selfOrigin) return false;                         // same-origin only
  if (u.search) return false;                                        // NEVER cache query-bearing URLs
  return /\/$/.test(u.pathname) ||                                   // deploy root
    /\/index\.html$/.test(u.pathname) ||
    /\/manifest\.webmanifest$/.test(u.pathname) ||
    /\/(?:icon-(?:192|512|512-maskable)\.png|pdf\.min\.js|pdf\.worker\.min\.js)$/.test(u.pathname);
}

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
  // nothing is written to the Cache API. This excludes every API, proxy, CDN and
  // credential-bearing request (search URLs, NCBI ?api_key=…, AI calls, PDFs).
  let sameOrigin = false;
  try { sameOrigin = new URL(req.url).origin === self.location.origin; } catch (err) { sameOrigin = false; }
  if (!sameOrigin) return;

  // Same-origin: network-first (freshest build wins online). A response is written
  // to the cache ONLY when swCacheableShell() approves it (app-shell allowlist, no
  // query string, 200 basic). Navigations fall back to the cached shell offline —
  // including query-bearing ones, whose URLs are still never stored.
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (swCacheableShell(req.url, res, self.location.origin)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});   // ignore quota failures
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((r) =>
          r || ((req.mode === 'navigate' || req.destination === 'document') ? caches.match('./index.html') : undefined)
        )
      )
  );
});
