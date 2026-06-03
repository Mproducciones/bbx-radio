'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav'

export function ClientBottomNav() {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const sync = () => setSheetOpen(document.body.dataset.sheetOpen === 'true')
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-sheet-open'] })
    return () => obs.disconnect()
  }, [])

  if (pathname === '/admin' || pathname.startsWith('/bbx') || sheetOpen) {
    return null
  }

  return <BottomNav />
}