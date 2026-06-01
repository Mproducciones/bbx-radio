'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function AdminAccessButton() {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onStart(e: TouchEvent) {
      if (e.touches.length < 2) return
      // 2+ dedos — iniciar timer si no hay uno corriendo
      if (timerRef.current) return
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        router.push('/admin')
      }, 1200)
    }

    function onEnd(e: TouchEvent) {
      // Solo cancelar si ya no quedan 2 dedos en pantalla
      if (e.touches.length >= 2) return
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend',   onEnd,   { passive: true })
    document.addEventListener('touchcancel', onEnd,  { passive: true })

    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend',   onEnd)
      document.removeEventListener('touchcancel', onEnd)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [router])

  return null
}
