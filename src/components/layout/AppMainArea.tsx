'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isAppScrollRoute } from '@/lib/appNavRoutes'

export function AppMainArea({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const scrollOnMobile = isAppScrollRoute(pathname)

  return (
    <div
      className={`app-mobile-main flex-1 min-w-0 overflow-x-hidden md:overflow-y-auto ${
        scrollOnMobile
          ? 'max-md:min-h-0 max-md:flex max-md:flex-col max-md:overflow-hidden max-md:overflow-x-hidden'
          : 'max-md:overflow-hidden'
      }`}
    >
      {children}
    </div>
  )
}
