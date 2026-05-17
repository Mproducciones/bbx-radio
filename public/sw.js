/**
 * Service Worker para Radio Bienvenida 93.3 FM
 */
'use strict'

const CACHE_NAME = 'radio-bienvenida-v5'
const STATIC_CACHE = 'radio-bienvenida-static-v5'
const DYNAMIC_CACHE = 'radio-bienvenida-dynamic-v5'

// Archivos estáticos para cachear inmediatamente
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Instalación: cachear archivos estáticos
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

// Activación: limpiar cachés antiguos
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

// Interceptar fetch: Network-first para contenido dinámico, Cache-first para estáticos
self.addEventListener('fetch', function(event) {
  var url = event.request.url

  // No cachear streams de audio/video
  if (
    url.includes('.m3u8') ||
    url.includes('.ts') ||
    url.includes('sonicstream') ||
    url.includes('tvstream') ||
    url.includes('stream')
  ) {
    return
  }

  // Para archivos estáticos, usar cache-first
  if (STATIC_FILES.some(function(file) { return url.includes(file) })) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request)
      })
    )
    return
  }

  // Para contenido dinámico, usar network-first con fallback a cache
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Cachear respuestas exitosas
        if (response.status === 200) {
          var clone = response.clone()
          caches.open(DYNAMIC_CACHE).then(function(cache) {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(function() {
        // Fallback a cache si no hay red
        return caches.match(event.request).then(function(cached) {
          if (cached) {
            return cached
          }
          // Página offline personalizada
          return caches.match('/').then(function(cached) {
            return cached || new Response('Offline - Radio Bienvenida', { 
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            })
          })
        })
      })
  )
})

// Sync background para cuando vuelve la conexión
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-ads') {
    event.waitUntil(
      // Aquí podrías implementar sincronización de datos
      Promise.resolve()
    )
  }
})