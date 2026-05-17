'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Toca 5 veces rápido la esquina inferior derecha → abre /bbx
// Zona: últimos 80px desde la derecha y 120px desde abajo
const ZONE_X = 80
const ZONE_Y = 120
const REQUIRED_TAPS = 5
const MAX_INTERVAL_MS = 2500

export function ThreeFingerGesture() {
  const router = useRouter()
  const pathname = usePathname()
  const tapsRef = useRef<number[]>([])

  useEffect(() => {
    if (pathname === '/bbx') return

    function onTouchEnd(e: TouchEvent) {
      const t = e.changedTouches[0]
      if (!t) return

      const fromRight = window.innerWidth - t.clientX
      const fromBottom = window.innerHeight - t.clientY

      if (fromRight > ZONE_X || fromBottom > ZONE_Y) {
        tapsRef.current = []
        return
      }

      const now = Date.now()
      tapsRef.current.push(now)

      // Descartar toques viejos
      tapsRef.current = tapsRef.current.filter(ts => now - ts < MAX_INTERVAL_MS)

      if (tapsRef.current.length >= REQUIRED_TAPS) {
        tapsRef.current = []
        router.push('/bbx')
      }
    }

    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => document.removeEventListener('touchend', onTouchEnd)
  }, [pathname, router])

  return null
}
