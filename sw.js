const CACHE_NAME = 'civic-hero-cache-v3';

// Dynamically determine the base scope (e.g. '/Civic-Hero/' on GitHub Pages or '/' on localhost)
const getBaseScope = () => {
  try {
    const scope = self.registration ? self.registration.scope : self.location.href;
    const url = new URL(scope);
    return url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  } catch {
    return '/Civic-Hero/';
  }
};

const BASE = getBaseScope();

const PRECACHE_URLS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'shield.svg',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
  BASE + 'issues/pothole.jpg',
  BASE + 'issues/garbage.jpg',
  BASE + 'issues/waterleak.jpg',
  BASE + 'issues/streetlight.jpg',
  BASE + 'issues/drain.jpg',
  BASE + 'issues/pothole_after.jpg',
  BASE + 'issues/garbage_after.jpg',
  BASE + 'issues/waterleak_after.jpg',
  BASE + 'issues/streetlight_after.jpg',
  BASE + 'issues/drain_after.jpg'
];

// Install: precache key assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url).catch((e) => console.warn('Pre-cache skip:', url, e)))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate / cache-first for images & assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle image and static asset caching
  if (
    url.pathname.includes('/issues/') ||
    url.pathname.includes('/icons/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Background revalidation
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          return caches.match(BASE + 'shield.svg');
        });
      })
    );
    return;
  }

  // HTML Navigation: Network-first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(BASE + 'index.html');
      })
    );
    return;
  }

  // Default fetch handler
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
