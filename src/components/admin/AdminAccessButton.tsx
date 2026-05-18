'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function AdminAccessButton() {
  const router = useRouter()
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchCountRef = useRef(0)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        touchCountRef.current = e.touches.length
        touchTimerRef.current = setTimeout(() => {
          if (touchCountRef.current >= 2) {
            router.push('/admin')
          }
        }, 1500)
      }
    }

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current)
        touchTimerRef.current = null
      }
      touchCountRef.current = 0
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    }
  }, [router])

  return null
}
