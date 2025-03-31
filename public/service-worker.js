// This is a minimal service worker to prevent 404 errors
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle fetch events - just pass through to the network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
}); 