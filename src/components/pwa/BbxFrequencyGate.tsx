'use client'

import { useRef, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { vibrateNow } from '@/lib/haptics'

const TAP_GOAL = 5
const TAP_WINDOW_MS = 2200

/** 5 toques rápidos en la frecuencia 93.3 → /bbx (secreto, no interfiere con admin 2 dedos) */
export function BbxFrequencyGate({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const router = useRouter()
  const taps = useRef<number[]>([])

  const onTap = useCallback(() => {
    const now = Date.now()
    taps.current = taps.current.filter(t => now - t < TAP_WINDOW_MS)
    taps.current.push(now)
    if (taps.current.length >= TAP_GOAL) {
      taps.current = []
      vibrateNow([20, 30, 20])
      router.push('/bbx')
    }
  }, [router])

  return (
    <button
      type="button"
      onClick={onTap}
      className={className}
      style={{ ...style, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
      aria-label="93.3 FM"
    >
      {children}
    </button>
  )
}
