// A more robust service worker for Agri-Guard PWA

const CACHE_NAME = 'agri-guard-cache-v2';
const DATA_CACHE_NAME = 'agri-guard-data-cache-v1';

// Pre-cache the app shell and critical assets
const CORE_ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/address-provider.js',
    '/pestDiseases.json',
    '/public/output.css', // Assuming this is the compiled Tailwind CSS
    'https://cdn.tailwindcss.com', // Fallback if the local one isn't used
    'https://unpkg.com/lucide@latest',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js',
    'https://cdn.jsdelivr.net/npm/idb@8/+esm',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    'https://placehold.co/192x192/22c55e/FFFFFF?text=AG',
    'https://placehold.co/512x512/22c55e/FFFFFF?text=AG',
    'https://placehold.co/96x96/e2e8f0/334155?text=User'
];

// URLs for the stale-while-revalidate strategy (our data files)
const DATA_URLS = [
    '/pestDiseases.json',
    'https://raw.githubusercontent.com/flores-jacob/philippine-regions-provinces-cities-municipalities-barangays/master/philippine_provinces_cities_municipalities_and_barangays_2019v2.json'
];

// 1. Installation: Open caches and add the core files.
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Pre-caching core assets:', CORE_ASSETS_TO_CACHE);
            return cache.addAll(CORE_ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. Activation: Clean up old caches.
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. Fetch: Intercept network requests and apply caching strategies.
self.addEventListener('fetch', event => {
    const { url } = event.request;

    // Strategy 1: Stale-While-Revalidate for our data files
    if (DATA_URLS.some(dataUrl => url.includes(dataUrl))) {
        console.log(`[Service Worker] Fetch (Stale-While-Revalidate): ${url}`);
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        console.log(`[Service Worker] Updating data cache for: ${url}`);
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    // Return cached response immediately, then fetch update in background
                    if(response) {
                        console.log(`[Service Worker] Serving from data cache: ${url}`);
                    }
                    return response || fetchPromise;
                });
            })
        );
        return;
    }

    // Strategy 2: Cache First for all other requests (app shell, images, etc.)
    event.respondWith(
        caches.match(event.request).then(response => {
            // Cache hit - return response
            if (response) {
                console.log(`[Service Worker] Serving from cache: ${url}`);
                return response;
            }

            console.log(`[Service Worker] Fetch (Cache First - Network): ${url}`);
            // Not in cache - fetch from network, then cache it
            return fetch(event.request).then(networkResponse => {
                // Don't cache unsuccessful responses or Firebase auth requests
                if (!networkResponse || networkResponse.status !== 200 || url.includes('googleapis.com/identitytoolkit')) {
                    return networkResponse;
                }

                console.log(`[Service Worker] Caching new asset: ${url}`);
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(error => {
                console.error('[Service Worker] Fetch failed:', error);
                // Optionally, return a fallback page or image
            });
        })
    );
});
