// NOTEKRAFT Service Worker
// Version 1.0.0 - Tokyo Night Storm PWA

const CACHE_NAME = 'notekraft-v1.0.0';
const STATIC_CACHE = 'notekraft-static-v1.0.0';
const DYNAMIC_CACHE = 'notekraft-dynamic-v1.0.0';

// Files to cache immediately (critical resources)
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Google Fonts (will be cached when requested)
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap',
  // Fallback page for offline navigation
  './offline.html'
];

// Files to cache on demand (subject pages, notes)
const CACHE_ON_DEMAND = [
  './becf/',
  './becf/index.html',
  './maths/',
  './maths/index.html', 
  './dld/',
  './dld/index.html',
  './python/',
  './python/index.html'
];

// Files to never cache (dynamic content, analytics)
const NEVER_CACHE = [
  '/analytics/',
  '/api/',
  'chrome-extension://'
];

// Install Event - Cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 NOTEKRAFT Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('⚡ NOTEKRAFT Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch Event - Serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip caching for certain requests
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) {
    return;
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    handleFetch(request, url)
  );
});

// Main fetch handler with cache strategies
async function handleFetch(request, url) {
  try {
    // Strategy 1: Cache First for static assets
    if (STATIC_ASSETS.includes(url.pathname) || isStaticAsset(url)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First for subject pages and notes
    if (isSubjectPage(url) || isNotePage(url)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Cache First for external resources (fonts, CDNs)
    if (url.origin !== location.origin) {
      return await cacheFirst(request);
    }
    
    // Strategy 4: Network First with cache fallback for everything else
    return await networkFirst(request);
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return await handleOffline(request, url);
  }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request, cache);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy - for dynamic content
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📡 Serving from cache (offline):', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background cache update
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Offline fallback handler
async function handleOffline(request, url) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Try to serve from any cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // For HTML requests, serve offline page
  if (request.headers.get('accept').includes('text/html')) {
    const offlinePage = await cache.match('./offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Create simple offline response
    return new Response(
      createOfflineHTML(),
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
  
  // For other requests, return network error
  return new Response('Network Error', {
    status: 408,
    statusText: 'Network Error'
  });
}

// Utility functions
function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf)$/i.test(url.pathname);
}

function isSubjectPage(url) {
  return /\/(becf|maths|dld|python)\/?$/i.test(url.pathname);
}

function isNotePage(url) {
  return /\/(becf|maths|dld|python)\/[^\/]+\.html$/i.test(url.pathname);
}

function createOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NOTEKRAFT - Offline</title>
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background: #121421;
                color: #FFFFFF;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .offline-container {
                max-width: 500px;
                padding: 2rem;
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                color: #00FFD1;
            }
            .offline-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1rem;
                background: linear-gradient(135deg, #00FFD1, #FFD700);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .offline-message {
                font-size: 1.1rem;
                color: #B3B3B3;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .retry-button {
                background: linear-gradient(135deg, #00FFD1, #8BE9FD);
                color: #121421;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            .retry-button:hover {
                transform: scale(1.05);
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1 class="offline-title">You're Offline</h1>
            <p class="offline-message">
                No internet connection detected. Don't worry - your cached notes are still available!
                Check your connection and try again.
            </p>
            <button class="retry-button" onclick="location.reload()">
                Try Again
            </button>
        </div>
    </body>
    </html>
  `;
}

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'CACHE_SUBJECT':
        cacheSubject(event.data.subject);
        break;
        
      case 'CLEAR_CACHE':
        clearAllCaches();
        break;
        
      case 'GET_CACHE_SIZE':
        getCacheSize().then(size => {
          event.ports[0].postMessage({ cacheSize: size });
        });
        break;
    }
  }
});

// Cache a specific subject's pages
async function cacheSubject(subject) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const urlsToCache = [
    `./${subject}/`,
    `./${subject}/index.html`
    // Add specific topic URLs as they're created
  ];
  
  try {
    await cache.addAll(urlsToCache);
    console.log(`📚 Cached ${subject} subject pages`);
  } catch (error) {
    console.error(`❌ Error caching ${subject}:`, error);
  }
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('🗑️ All caches cleared');
}

// Get total cache size
async function getCacheSize() {
  let totalSize = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const clone = response.clone();
        const buffer = await clone.arrayBuffer();
        totalSize += buffer.byteLength;
      }
    }
  }
  
  return totalSize;
}

console.log('🚀 NOTEKRAFT Service Worker loaded successfully!');