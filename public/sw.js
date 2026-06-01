'use strict'

const STATIC_CACHE = 'radio-bienvenida-static-v10'
const DYNAMIC_CACHE = 'radio-bienvenida-dynamic-v10'

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

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', function(event) {
  var data = {}
  try { data = event.data ? event.data.json() : {} } catch(e) {}
  var title   = data.title   || 'Radio Bienvenida'
  var body    = data.body    || ''
  var url     = data.url     || '/'
  var options = {
    body:    body,
    icon:    '/icons/icon-192.png',
    badge:   '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data:    { url: url },
    actions: [{ action: 'open', title: 'Ver ahora' }],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  var url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i]
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})

// ── Fetch cache ───────────────────────────────────────────────────────────────
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
