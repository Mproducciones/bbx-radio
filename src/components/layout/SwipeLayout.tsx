'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isAppScrollRoute } from '@/lib/appNavRoutes'
import { appNavIndex } from '@/lib/appNavRoutes'
import { tabCrossfade, tabCrossfadeTransition } from '@/lib/motion/framer'

interface SwipeLayoutProps {
  children: ReactNode
}

/** Contenedor de rutas — crossfade entre tabs principales; scroll libre en rutas secundarias. */
export function SwipeLayout({ children }: SwipeLayoutProps) {
  const pathname = usePathname()
  const isTabShell =
    !isAppScrollRoute(pathname)
    && !pathname.startsWith('/admin')
    && !pathname.startsWith('/studio')

  const isPrimaryTab = appNavIndex(pathname) !== -1
  const tabKey = isPrimaryTab ? `tab-${appNavIndex(pathname)}` : pathname

  if (!isTabShell) {
    return (
      <div className="app-scroll-route flex-1 min-h-0 w-full min-w-0 max-w-full">
        {children}
      </div>
    )
  }

  return (
    <div className="app-mobile-page flex flex-1 flex-col min-h-0 w-full min-w-0 max-w-full overflow-x-hidden overflow-y-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={tabKey}
          className="flex flex-1 flex-col min-h-0 w-full min-w-0 max-w-full overflow-x-hidden overflow-y-hidden"
          initial={tabCrossfade.initial}
          animate={tabCrossfade.animate}
          exit={tabCrossfade.exit}
          transition={tabCrossfadeTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
