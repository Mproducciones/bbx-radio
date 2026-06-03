'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { isAppScrollRoute } from '@/lib/appNavRoutes'

/** Shell móvil: tabs con inset; rutas scroll (/bbx, /anunciate) full-bleed con gutter propio. */
export function AppMobileInset({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const flush = isAppScrollRoute(pathname)

  return (
    <div
      className={cn(
        'app-mobile-inset relative z-[1] flex flex-1 flex-col min-h-0 min-w-0 w-full max-w-full md:contents',
        flush && 'app-mobile-inset--flush',
      )}
    >
      {children}
    </div>
  )
}
