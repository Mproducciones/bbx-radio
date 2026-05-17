'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Deslizar 2 dedos hacia arriba rápidamente → abre /bbx
// Distancia mínima: 90px · Tiempo máximo: 500ms
export function ThreeFingerGesture() {
  const router = useRouter()
  const pathname = usePathname()
  const startY = useRef<number[]>([])
  const startTime = useRef(0)

  useEffect(() => {
    if (pathname === '/bbx') return

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        startY.current = [e.touches[0].clientY, e.touches[1].clientY]
        startTime.current = Date.now()
      } else {
        startY.current = []
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (startY.current.length !== 2) return
      if (e.changedTouches.length < 1) return

      const elapsed = Date.now() - startTime.current
      if (elapsed > 500) { startY.current = []; return }

      // Calcular cuánto subieron ambos dedos (negativo = arriba)
      const t = e.changedTouches
      if (t.length < 2) { startY.current = []; return }

      const dy0 = t[0].clientY - startY.current[0]
      const dy1 = t[1].clientY - startY.current[1]

      // Ambos dedos deben subir más de 90px
      if (dy0 < -90 && dy1 < -90) {
        router.push('/bbx')
      }

      startY.current = []
    }

    function onTouchCancel() {
      startY.current = []
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchCancel, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [pathname, router])

  return null
}
