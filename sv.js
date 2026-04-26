// This is the Service Worker: sv.js
const CACHE_NAME = 'chordora-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Install Event (Caches files)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate Event (Cleans up old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. MANDATORY FETCH EVENT (Required for Installability)
// This basic version allows the request to pass through to the network.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails, serve from cache
      return caches.match(event.request);
    })
  );
});
