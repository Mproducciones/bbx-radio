'use client'

import { useEffect, useRef } from 'react'

/** Registro del SW solo en cliente — evita scripts en <head> que rompen hidratación. */
export function ServiceWorkerRegister() {
  const regRef = useRef<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').then(reg => {
      regRef.current = reg
      reg.update()
      window.setInterval(() => reg.update(), 30 * 60 * 1000)
    }).catch(() => {})

    function onSwMessage(e: MessageEvent) {
      if (e.data?.type === 'BBX_PUSH') {
        window.dispatchEvent(new CustomEvent('bbx-notifications-refresh'))
        window.dispatchEvent(new CustomEvent('bbx-push-toast', {
          detail: {
            id: e.data.id || `push-${Date.now()}`,
            title: e.data.title,
            body: e.data.body || '',
            url: e.data.url || '/',
          },
        }))
      }
    }
    navigator.serviceWorker.addEventListener('message', onSwMessage)

    function onVisible() {
      if (document.visibilityState === 'visible') regRef.current?.update()
    }
    document.addEventListener('visibilitychange', onVisible)

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      navigator.serviceWorker.removeEventListener('message', onSwMessage)
    }
  }, [])

  return null
}
