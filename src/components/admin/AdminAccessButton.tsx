'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { vibrateNow } from '@/lib/haptics'

/** Mantener 2 dedos ~1,2 s para abrir panel oculto */
const HOLD_MS = 1200

const DISABLED_PREFIXES = ['/admin', '/bbx-admin', '/studio']

function adminTarget(pathname: string): string | null {
  if (DISABLED_PREFIXES.some(p => pathname.startsWith(p))) return null
  if (pathname === '/bbx') return '/bbx-admin'
  return '/admin'
}

export function AdminAccessButton() {
  const router = useRouter()
  const pathname = usePathname()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const targetRef = useRef<string | null>(null)

  useEffect(() => {
    targetRef.current = adminTarget(pathname)
  }, [pathname])

  useEffect(() => {
    function onStart(e: TouchEvent) {
      if (e.touches.length < 2) return
      const target = targetRef.current
      if (!target || timerRef.current) return
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        vibrateNow([12, 28, 12])
        router.push(target)
      }, HOLD_MS)
    }

    function onEnd(e: TouchEvent) {
      if (e.touches.length >= 2) return
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    document.addEventListener('touchcancel', onEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', onEnd)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [router])

  return null
}
