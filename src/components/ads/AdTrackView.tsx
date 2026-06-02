'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { impressionKey, trackAdEvent } from '@/lib/trackAd'

type Props = {
  adId: string
  adTipo: string
  placement: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AdTrackView({ adId, adTipo, placement, children, className, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adId || adId === 'demo') return
    const el = ref.current
    if (!el) return

    const key = impressionKey(adId, placement)
    if (sessionStorage.getItem(key)) return

    const obs = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return
        sessionStorage.setItem(key, '1')
        trackAdEvent({ adId, adTipo, eventType: 'impression', placement })
        obs.disconnect()
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [adId, adTipo, placement])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function trackAdClick(adId: string, adTipo: string, placement: string) {
  trackAdEvent({ adId, adTipo, eventType: 'click', placement })
}
