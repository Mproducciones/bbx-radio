'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isAppScrollRoute } from '@/lib/appNavRoutes'

interface SwipeLayoutProps {
  children: ReactNode
}

/** Contenedor de rutas — sin swipe ni transiciones slide entre pantallas. */
export function SwipeLayout({ children }: SwipeLayoutProps) {
  const pathname = usePathname()
  const isTabShell =
    !isAppScrollRoute(pathname)
    && !pathname.startsWith('/admin')
    && !pathname.startsWith('/studio')

  if (!isTabShell) {
    return (
      <div className="app-scroll-route flex-1 min-h-0 w-full min-w-0 max-w-full">
        {children}
      </div>
    )
  }

  return (
    <div className="app-mobile-page flex flex-1 flex-col min-h-0 w-full min-w-0 max-w-full overflow-x-hidden overflow-y-hidden">
      {children}
    </div>
  )
}
