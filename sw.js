// Service Worker for Agri-Guard PWA (sw.js)

const CACHE_NAME = 'agri-guard-cache-v2'; // Bumped version
const IMMUTABLE_CACHE_NAME = 'agri-guard-immutable-cache-v2';

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

    // Strategy: Stale-While-Revalidate for specific dynamic assets
    if (staleWhileRevalidateFiles.includes(url.href)) {
        event.respondWith(staleWhileRevalidate(event));
    }
    // Strategy: Cache First for everything else (app shell, immutable assets)
    else {
        event.respondWith(cacheFirst(event));
    }
});

// Stale-While-Revalidate strategy
async function staleWhileRevalidate(event) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    const fetchPromise = fetch(event.request).then(networkResponse => {
        // Check for a valid response before caching
        if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(err => {
        console.warn('Service Worker: Fetch failed, falling back to cache if available.', err);
        // If fetch fails, we still have the cachedResponse (if it exists)
        return cachedResponse || Promise.reject(err);
    });

    // Return cached response immediately if available, otherwise wait for fetch
    return cachedResponse || fetchPromise;
}

// Cache-First strategy
async function cacheFirst(event) {
    // Try to find the response in any of the caches
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // If not in cache, go to the network
    try {
        const networkResponse = await fetch(event.request);
        // We don't cache responses here by default under this strategy,
        // as all expected assets should have been pre-cached.
        // This prevents caching random, unexpected requests.
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Fetch error for a cache-first resource.', error);
        // Optional: Return a generic fallback page for navigation requests
        // if (event.request.mode === 'navigate') {
        //     return caches.match('/offline.html');
        // }
        throw error;
    }
}
