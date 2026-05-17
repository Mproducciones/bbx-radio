'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function ThreeFingerGesture() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/bbx') return

    let timer: ReturnType<typeof setTimeout> | null = null

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length >= 3) {
        // Espera 400ms con 3 dedos para confirmar el gesto
        timer = setTimeout(() => {
          router.push('/bbx')
        }, 400)
      }
    }

    function onTouchEnd() {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
    document.addEventListener('touchcancel', onTouchEnd)

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
      if (timer) clearTimeout(timer)
    }
  }, [pathname, router])

  return null
}
