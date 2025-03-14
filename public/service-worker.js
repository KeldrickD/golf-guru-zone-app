// Service Worker for Golf Guru Zone
const CACHE_NAME = 'golf-guru-cache-v1';

// Resources to cache initially
const INITIAL_CACHED_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add CSS, JS, and other important static assets
  // These can be expanded as needed
];

// Install event - cache initial resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching initial resources');
        return cache.addAll(INITIAL_CACHED_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// API endpoints to potentially cache
const API_ENDPOINTS = [
  '/api/rounds',
  '/api/courses',
  '/api/stats',
];

// Background sync tag for offline round tracking
const ROUNDS_SYNC_TAG = 'offline-rounds-sync';

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const requestUrl = new URL(event.request.url);
  
  // Special handling for API requests - network first then cache
  if (API_ENDPOINTS.some(endpoint => requestUrl.pathname.includes(endpoint))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh API response for offline use
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Standard cache-first strategy for non-API requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return from cache if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache the new response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Handle offline round submissions via background sync
self.addEventListener('sync', (event) => {
  if (event.tag === ROUNDS_SYNC_TAG) {
    event.waitUntil(syncOfflineRounds());
  }
});

// Function to sync offline rounds when back online
async function syncOfflineRounds() {
  try {
    // Get all offlineRounds from IndexedDB
    const offlineRounds = await getOfflineRoundsFromDb();
    
    for (const round of offlineRounds) {
      try {
        // Attempt to send each round to the server
        const response = await fetch('/api/rounds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(round)
        });
        
        if (response.ok) {
          // If successful, remove from offline storage
          await removeRoundFromOfflineDb(round.id);
        }
      } catch (err) {
        console.error('Failed to sync round:', err);
        // Keep in offline storage to try again later
      }
    }
    
    // Notify any open clients about the sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'ROUNDS_SYNCED',
        success: true
      });
    });
    
  } catch (err) {
    console.error('Error during background sync:', err);
  }
}

// Placeholder functions for IndexedDB operations
// These would be implemented with actual IndexedDB code
async function getOfflineRoundsFromDb() {
  // This is a placeholder - actual implementation would use IndexedDB
  return [];
}

async function removeRoundFromOfflineDb(id) {
  // This is a placeholder - actual implementation would use IndexedDB
  console.log('Removing synced round from offline storage:', id);
} 