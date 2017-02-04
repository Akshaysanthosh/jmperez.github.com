const CACHE_VERSION = 1;
let CURRENT_CACHE = 'main-v' + CACHE_VERSION;

const cacheFiles = [
  '/',
  '/about-me/',
  '/projects/',
  '/offline/'
];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CURRENT_CACHE) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('install', event => {
  console.log('installing ' + CURRENT_CACHE);
  console.log('test');

  event.waitUntil(
    caches.open(CURRENT_CACHE)
      .then(function(cache) {
        console.log('Opened cache ' + CURRENT_CACHE);
        return cache.addAll(cacheFiles);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Grab the asset from SW cache.
        if (response) {
          return response;
        }
        return fetch(event.request);
    }).catch(() => {
      // Can't access the network return an offline page from the cache
      return caches.match('/offline/');
    })
  );
});
