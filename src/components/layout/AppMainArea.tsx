'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const SCROLL_ROUTES = ['/bbx', '/anunciate', '/admin', '/studio']

export function AppMainArea({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const scrollOnMobile = SCROLL_ROUTES.some(r => pathname.startsWith(r))

  return (
    <div
      className={`app-mobile-main flex-1 md:overflow-y-auto ${
        scrollOnMobile
          ? 'max-md:min-h-0 max-md:overflow-y-auto max-md:overflow-x-hidden max-md:overscroll-contain'
          : 'max-md:overflow-hidden'
      }`}
    >
      {children}
    </div>
  )
}
