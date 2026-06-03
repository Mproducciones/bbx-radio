'use strict'

const STATIC_CACHE  = 'radio-bienvenida-static-v23'
const IMAGE_CACHE   = 'radio-bienvenida-images-v23'

const STATIC_FILES = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
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

const MAX_IMAGE_ENTRIES = 80

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys  = await cache.keys()
  if (keys.length > maxItems) {
    await cache.delete(keys[0])
    await trimCache(cacheName, maxItems)
  }
}

function isNeverCache(url) {
  return NEVER_CACHE.some(function(pattern) { return url.includes(pattern) })
}

function safeNotificationUrl(raw) {
  var fallback = '/'
  if (!raw || typeof raw !== 'string') return fallback
  var trimmed = raw.trim()
  if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) return fallback
  if (trimmed.charAt(0) === '/' && trimmed.charAt(1) !== '/') return trimmed.split(/[\r\n]/)[0].slice(0, 500)
  try {
    var u = new URL(trimmed, self.location.origin)
    if (u.origin === self.location.origin) return u.pathname + u.search + u.hash || '/'
  } catch (e) {}
  return fallback
}

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

// ── Activate — purge old caches (incl. HTML/JSON caches from v11) ─────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) {
            return name !== STATIC_CACHE && name !== IMAGE_CACHE
          })
          .map(function(name) {
            return caches.delete(name)
          })
      )
    })
  )
  return self.clients.claim()
})

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', function(event) {
  var data = {}
  try { data = event.data ? event.data.json() : {} } catch(e) {}
  var title   = data.title || 'Radio Bienvenida'
  var body    = data.body  || ''
  var url     = safeNotificationUrl(data.url || '/')
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
  var url = safeNotificationUrl(
    (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/'
  )
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

// ── Fetch — solo manifest/iconos e imágenes; HTML/JS/API van directo a red ────
self.addEventListener('fetch', function(event) {
  var url    = event.request.url
  var method = event.request.method

  if (method !== 'GET') return
  if (isNeverCache(url)) return

  // Navegación y assets de la app: sin interceptar (evita HTML/JS obsoleto)
  if (event.request.mode === 'navigate') return
  if (url.includes('/_next/')) return
  if (event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      event.request.destination === 'document') return

  var isStatic = STATIC_FILES.some(function(file) { return url.includes(file) })
  var isImage  = event.request.destination === 'image' ||
    /\.(png|jpg|jpeg|webp|gif|svg|ico)(\?|$)/i.test(url)

  if (!isStatic && !isImage) return

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request)
      })
    )
    return
  }

  // Imágenes: cache-first con actualización en segundo plano
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var network = fetch(event.request).then(function(response) {
        if (response.status === 200) {
          var clone = response.clone()
          caches.open(IMAGE_CACHE).then(function(cache) {
            cache.put(event.request, clone)
            trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES)
          })
        }
        return response
      })
      return cached || network
    })
  )
})
