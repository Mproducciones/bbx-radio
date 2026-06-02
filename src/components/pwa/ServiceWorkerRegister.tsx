'use client'

import { useEffect } from 'react'

/** Registro del SW solo en cliente — evita scripts en <head> que rompen hidratación. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').then(reg => {
      window.setInterval(() => reg.update(), 30 * 60 * 1000)
    }).catch(() => {})

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  return null
}
