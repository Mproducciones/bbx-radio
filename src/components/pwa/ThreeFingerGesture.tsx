'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Doble toque con 2 dedos → abre /bbx
// No conflicta con admin (2 dedos QUIETOS 1.5s)
const MAX_GAP_MS = 500 // máximo entre los dos toques

export function ThreeFingerGesture() {
  const router = useRouter()
  const pathname = usePathname()
  const lastTwoFingerTap = useRef<number>(0)

  useEffect(() => {
    if (pathname === '/bbx') return

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 2) return

      const now = Date.now()
      const gap = now - lastTwoFingerTap.current

      if (gap < MAX_GAP_MS && gap > 80) {
        // Segundo toque con 2 dedos dentro del intervalo → abrir BBX
        router.push('/bbx')
        lastTwoFingerTap.current = 0
      } else {
        lastTwoFingerTap.current = now
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    return () => document.removeEventListener('touchstart', onTouchStart)
  }, [pathname, router])

  return null
}
