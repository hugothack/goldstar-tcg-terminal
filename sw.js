// ─── GoldStar TCG Terminal — Service Worker v5 ───
const CACHE_NAME = 'goldstar-v5-cache';

// Critical shell to precache on install
const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png'
];

// CDN resources — cached on first load (runtime caching)
const CDN_HOSTS = [
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// ─── INSTALL: precache critical shell ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: clean old caches ───
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH: strategy per request type ───
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Network-first for API / CGI calls — never cache backend
  if (url.pathname.includes('cgi-bin') || url.pathname.includes('api.py')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response(
          JSON.stringify({ error: 'Offline — API unavailable' }),
          { headers: { 'Content-Type': 'application/json' } }
        ))
    );
    return;
  }

  // CDN resources (Chart.js, Google Fonts): stale-while-revalidate
  if (CDN_HOSTS.some(host => url.hostname.includes(host))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const fetchPromise = fetch(event.request).then(response => {
            if (response && response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);

          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Static assets (HTML, CSS, JS, icons): cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful responses for local resources
        if (response && response.ok && url.origin === self.location.origin) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
