'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav'
import { AppMoreSheet } from './AppMoreSheet'
import { TvLiveOverlay } from '@/components/tv/TvLiveOverlay'

export function ClientBottomNav() {
  const pathname = usePathname()
  const [planSheetOpen, setPlanSheetOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    const sync = () => setPlanSheetOpen(document.body.dataset.planSheetOpen === 'true')
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-plan-sheet-open'] })
    return () => obs.disconnect()
  }, [])

  if (pathname === '/admin' || pathname.startsWith('/bbx') || planSheetOpen) {
    return null
  }

  return (
    <>
      <BottomNav
        onMoreOpen={() => setMoreOpen(true)}
        onNavInteract={() => setMoreOpen(false)}
      />
      <AppMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <TvLiveOverlay />
    </>
  )
}