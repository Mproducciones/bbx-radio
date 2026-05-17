'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ZONE_X = 100
const ZONE_Y = 140
const REQUIRED_TAPS = 5
const MAX_INTERVAL_MS = 2500

export function ThreeFingerGesture() {
  const router = useRouter()
  const pathname = usePathname()
  const tapsRef = useRef<number[]>([])
  const [count, setCount] = useState(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pathname === '/bbx') return

    function onTouchEnd(e: TouchEvent) {
      const t = e.changedTouches[0]
      if (!t) return

      const fromRight = window.innerWidth - t.clientX
      const fromBottom = window.innerHeight - t.clientY

      if (fromRight > ZONE_X || fromBottom > ZONE_Y) {
        return
      }

      const now = Date.now()
      tapsRef.current.push(now)
      tapsRef.current = tapsRef.current.filter(ts => now - ts < MAX_INTERVAL_MS)

      setCount(tapsRef.current.length)

      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => {
        tapsRef.current = []
        setCount(0)
      }, MAX_INTERVAL_MS)

      if (tapsRef.current.length >= REQUIRED_TAPS) {
        tapsRef.current = []
        setCount(0)
        if (resetTimer.current) clearTimeout(resetTimer.current)
        router.push('/bbx')
      }
    }

    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchend', onTouchEnd)
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [pathname, router])

  if (count === 0 || pathname === '/bbx') return null

  return (
    <div className="fixed bottom-[130px] right-4 z-[950] pointer-events-none">
      <div className="flex flex-col items-center gap-1">
        {/* Puntos indicadores */}
        <div className="flex gap-1">
          {Array.from({ length: REQUIRED_TAPS }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-150"
              style={{
                background: i < count ? '#db8918' : 'rgba(219,137,24,0.2)',
                transform: i < count ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#db8918] font-bold opacity-80">
          {count}/{REQUIRED_TAPS}
        </span>
      </div>
    </div>
  )
}
