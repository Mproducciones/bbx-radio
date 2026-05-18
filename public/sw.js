'use strict'

const STATIC_CACHE = 'radio-bienvenida-static-v8'
const DYNAMIC_CACHE = 'radio-bienvenida-dynamic-v8'

const STATIC_FILES = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

const CACHEABLE_ORIGINS = [
  self.location.origin,
  'https://cdn.sanity.io',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
]

const NEVER_CACHE = [
  '/api/',
  '/admin',
  '/studio',
  '.m3u8',
  '.ts',
  'sonicstream',
  'tvstream',
  'stream',
]

const MAX_DYNAMIC_ENTRIES = 60

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length > maxItems) {
    await cache.delete(keys[0])
    await trimCache(cacheName, maxItems)
  }
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) {
            return name !== STATIC_CACHE && name !== DYNAMIC_CACHE
          })
          .map(function(name) {
            return caches.delete(name)
          })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function(event) {
  var url = event.request.url
  var method = event.request.method

  if (method !== 'GET') return

  if (NEVER_CACHE.some(function(pattern) { return url.includes(pattern) })) return

  var allowed = CACHEABLE_ORIGINS.some(function(origin) { return url.startsWith(origin) })
  if (!allowed) return

  if (STATIC_FILES.some(function(file) { return url.includes(file) })) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request)
      })
    )
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (response.status === 200) {
          var contentType = response.headers.get('content-type') || ''
          var isCacheable = contentType.includes('text/') ||
            contentType.includes('application/json') ||
            contentType.includes('image/')
          if (isCacheable) {
            var clone = response.clone()
            caches.open(DYNAMIC_CACHE).then(function(cache) {
              cache.put(event.request, clone)
              trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ENTRIES)
            })
          }
        }
        return response
      })
      .catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          })
        })
      })
  )
})
