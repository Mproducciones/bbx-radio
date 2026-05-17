'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Doble toque con 2 dedos → abre /bbx
// Detecta cuando se levantan 2 dedos (touchend con 0 restantes)
// dos veces seguidas en menos de 600ms
const MAX_GAP_MS = 600

export function ThreeFingerGesture() {
  const pathname = usePathname()
  const lastRelease = useRef<number>(0)
  const fingerCount = useRef<number>(0)

  useEffect(() => {
    if (pathname === '/bbx') return

    function onTouchStart(e: TouchEvent) {
      fingerCount.current = e.touches.length
    }

    function onTouchEnd(e: TouchEvent) {
      // Solo nos interesa cuando se levantaban exactamente 2 dedos
      // y ya no queda ninguno en pantalla
      if (fingerCount.current === 2 && e.touches.length === 0) {
        const now = Date.now()
        const gap = now - lastRelease.current

        if (gap < MAX_GAP_MS && gap > 100) {
          // Segundo release de 2 dedos → navegar
          lastRelease.current = 0
          window.location.href = '/bbx'
        } else {
          lastRelease.current = now
        }
      }
      fingerCount.current = e.touches.length
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [pathname])

  return null
}
