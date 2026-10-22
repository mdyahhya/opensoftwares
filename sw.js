/**
 * OpenSoftwares — Service Worker (sw.js)
 * Network-First Auto-Update Strategy:
 * - Always fetches live code directly from GitHub / Vercel (no stale code cache).
 * - Automatically updates immediately whenever any change is pushed to GitHub.
 * - Requires NO manual version bumps.
 * - Activates immediately via self.skipWaiting() and self.clients.claim().
 * - Falls back to cache ONLY if completely offline.
 */

const OFFLINE_CACHE_NAME = 'opensoftwares-offline-v1';

// Install: Activate immediately without waiting for tabs to close
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: Claim clients immediately and wipe old stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== OFFLINE_CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// Fetch: Strictly Network-First with cache bypass for live updates
self.addEventListener('fetch', (event) => {
  // Only process standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip browser extensions and non-HTTP(S)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // For all site assets (HTML, CSS, JS, etc.), always fetch live from network first
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((networkResponse) => {
        // If successful, update offline backup cache in background
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(OFFLINE_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed (offline) — serve offline cached copy
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If offline navigation request, fall back to cached index
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html') || caches.match('/');
          }
          return new Response('Offline: Network connection unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

// Message listener to trigger immediate skipWaiting or clearCache
self.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
    if (event.data.action === 'clearCache') {
      caches.keys().then((keys) => {
        return Promise.all(keys.map((k) => caches.delete(k)));
      });
    }
  }
});
