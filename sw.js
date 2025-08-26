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
];

const REMOTE_ASSETS_TO_CACHE = [
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
            const coreAssetsPromise = cache.addAll(CORE_ASSETS_TO_CACHE);

            console.log('[Service Worker] Pre-caching remote assets:', REMOTE_ASSETS_TO_CACHE);
            const remoteAssetsPromises = REMOTE_ASSETS_TO_CACHE.map(url => {
                // Important: We fetch with the default 'cors' mode.
                // 'no-cors' would lead to opaque responses that can't be validated and cause errors.
                return fetch(url)
                    .then(response => {
                        // Ensure we got a valid response before caching.
                        if (!response.ok) {
                            throw new Error(`Server responded with ${response.status} for ${url}`);
                        }
                        return cache.put(url, response);
                    })
                    .catch(error => {
                        // This catch is important to prevent one failed asset from stopping the entire service worker installation.
                        console.error(`[Service Worker] Failed to fetch and cache ${url}:`, error);
                    });
            });

            return Promise.all([coreAssetsPromise, ...remoteAssetsPromises]);
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
    // Ignore non-GET requests, such as POST requests to Firebase Storage.
    if (event.request.method !== 'GET') {
        return;
    }

    const { url } = event.request;

    // Strategy 1: Stale-While-Revalidate for our data files
    if (DATA_URLS.some(dataUrl => url.includes(dataUrl))) {
        console.log(`[Service Worker] Fetch (Stale-While-Revalidate): ${url}`);
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    // Define the fetch promise to get fresh data.
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        console.log(`[Service Worker] Updating data cache for: ${url}`);
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });

                    // If we have a cached response, return it immediately.
                    // Also, "fire and forget" the fetch to update the cache in the background.
                    // A .catch is added to prevent unhandled promise rejections on network failure.
                    if (response) {
                        console.log(`[Service Worker] Serving from data cache: ${url}`);
                        fetchPromise.catch(err => console.warn(`[SW] Background cache update for ${url} failed.`, err));
                        return response;
                    }

                    // If we don't have a cached response, we must wait for the network.
                    // The browser will show an offline error if this fetch fails.
                    return fetchPromise;
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
