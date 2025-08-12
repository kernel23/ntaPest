// Service Worker for Agri-Guard PWA (sw.js)

const CACHE_NAME = 'agri-guard-cache-v3'; // Bumped version
const IMMUTABLE_CACHE_NAME = 'agri-guard-immutable-cache-v3'; // Bumped version

// Assets that are part of the app's "shell" and are unlikely to change
const appShellFiles = [
  '/',
  '/index.html',
  '/manifest.json',
  '/address-provider.js',
  '/assets/js/idb.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/google-logo.svg',
];

// Assets that are hosted on CDNs and are versioned, so they won't change
const immutableFiles = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js'
];

// Assets that might be updated, but we can serve a cached version first
const staleWhileRevalidateFiles = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://raw.githubusercontent.com/flores-jacob/philippine-regions-provinces-cities-municipalities-barangays/master/philippine_provinces_cities_municipalities_and_barangays_2019v2.json'
];

// 1. Installation: Open caches and add the core files.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
        caches.open(CACHE_NAME).then(cache => {
            console.log('Service Worker: Caching app shell');
            return cache.addAll(appShellFiles);
        }),
        caches.open(IMMUTABLE_CACHE_NAME).then(cache => {
            console.log('Service Worker: Caching immutable assets');
            return cache.addAll(immutableFiles);
        })
    ]).catch(err => {
        console.error('Service Worker: Caching failed', err);
    })
  );
});

// 2. Activation: Clean up old caches.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME, IMMUTABLE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch: Intercept network requests.
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Strategy: Network First for navigation requests (to get latest index.html)
    if (event.request.mode === 'navigate') {
        event.respondWith(networkFirst(event));
        return;
    }

    // Strategy: Stale-While-Revalidate for specific dynamic assets
    if (staleWhileRevalidateFiles.includes(url.href)) {
        event.respondWith(staleWhileRevalidate(event));
        return;
    }

    // Strategy: Cache First for everything else (app shell, immutable assets)
    event.respondWith(cacheFirst(event));
});

// Network-First, Falling Back to Cache strategy
async function networkFirst(event) {
    try {
        const networkResponse = await fetch(event.request);
        // If we get a response, update the cache and return it
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.warn('Network request failed, falling back to cache for:', event.request.url);
        return caches.match(event.request);
    }
}

// Stale-While-Revalidate strategy
async function staleWhileRevalidate(event) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(err => {
        console.warn('Service Worker: Fetch failed, falling back to cache if available.', err);
        return cachedResponse || Promise.reject(err);
    });

    return cachedResponse || fetchPromise;
}

// Cache-First strategy
async function cacheFirst(event) {
    const cachedResponse = await caches.match(event.request);
    return cachedResponse || fetch(event.request).then(networkResponse => {
        // For cache-first, we generally assume assets are pre-cached.
        // However, it can be useful to cache assets that were missed during install.
        if (networkResponse && networkResponse.ok) {
            const cache = event.request.url.includes('firebase') ? caches.open(IMMUTABLE_CACHE_NAME) : caches.open(CACHE_NAME);
            cache.then(c => c.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(error => {
        console.error('Service Worker: Fetch error for a cache-first resource.', error);
        throw error;
    });
}
