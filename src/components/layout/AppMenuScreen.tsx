'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TabContextBar } from '@/components/layout/TabContextBar'
import { EASE_OUT } from '@/lib/motion/framer'

interface AppMenuScreenProps {
  children: ReactNode
  className?: string
  /** false = pantalla fija; true = scroll libre; 'snap' = scroll con secciones a pantalla completa */
  scroll?: boolean | 'snap'
  /** Barra En Vivo / TV / notificaciones — tabs principales oyente */
  contextBar?: boolean
}

/** Contenedor móvil: scroll libre o pantalla fija; gutter y contexto unificados. */
export function AppMenuScreen({
  children,
  className,
  scroll = false,
  contextBar = false,
}: AppMenuScreenProps) {
  const isScroll = scroll === true || scroll === 'snap'
  const isSnap = scroll === 'snap'

  const body = (
    <motion.div
      className="scroll-tab-shell__body w-full min-w-0 max-w-full flex flex-col flex-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      {contextBar && (
        <div className="md:hidden mb-2 shrink-0">
          <TabContextBar />
        </div>
      )}
      {children}
    </motion.div>
  )

  if (isScroll) {
    return (
      <main
        className={cn(
          'scroll-tab-shell scroll-tab-shell--panel relative z-[1] mx-auto w-full min-w-0 max-w-full md:max-w-2xl',
          'max-md:flex-1 max-md:min-h-0 max-md:flex max-md:flex-col',
          'max-md:pt-[var(--app-content-pad-y)] max-md:pb-[calc(var(--app-nav-total)+1rem)]',
          'md:min-h-screen md:px-4 md:pt-6 md:pb-24',
          isSnap && 'app-scroll-snap',
          className,
        )}
      >
        <div className="app-gutter-x app-page-column w-full min-w-0 flex flex-col flex-1 max-md:min-h-0">
          {body}
        </div>
      </main>
    )
  }

  return (
    <main
      className={cn(
        'relative z-[1] mx-auto w-full min-w-0 max-w-full md:max-w-2xl',
        'app-mobile-page max-md:overflow-hidden',
        'max-md:pt-[var(--app-content-pad-y)] max-md:pb-0',
        'md:min-h-screen md:px-4 md:pt-6 md:pb-24',
        className,
      )}
    >
      <div className="max-md:flex max-md:flex-1 max-md:flex-col max-md:min-h-0 max-md:h-full max-md:overflow-hidden">
        {children}
      </div>
    </main>
  )
}
