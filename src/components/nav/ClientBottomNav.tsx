'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav'
import { NavMoreSheet } from './NavMoreSheet'

export function ClientBottomNav() {
  const pathname = usePathname()
  const [planSheetOpen, setPlanSheetOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

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
      <BottomNav onMoreOpen={() => setMoreOpen(true)} />
      <NavMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}