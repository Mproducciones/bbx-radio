'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion/framer'
import { EnVivoStageHeader } from '@/components/player/EnVivoStageHeader'
import { EnVivoIntroSplash } from '@/components/player/EnVivoIntroSplash'

const INTRO_STORAGE_KEY = 'pulso_envivo_intro_v2'

type Phase = 'intro' | 'player'

interface EnVivoMobileStageProps {
  locale?: ReactNode
  children: ReactNode
  className?: string
}

/** Escenario En Vivo — panel limpio, intro → reproductor, sin cajas duras. */
export function EnVivoMobileStage({ locale, children, className }: EnVivoMobileStageProps) {
  const [phase, setPhase] = useState<Phase>('player')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = sessionStorage.getItem(INTRO_STORAGE_KEY)
    if (!seen) {
      setPhase('intro')
      const t = window.setTimeout(() => {
        setPhase('player')
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
      }, 2200)
      return () => window.clearTimeout(t)
    }
  }, [])

  const showIntro = mounted && phase === 'intro'

  return (
    <motion.section
      className={`envivo-stage flex flex-col flex-1 min-h-0 min-w-0 w-full max-w-full ${className ?? ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      aria-label="Radio en vivo"
    >
      <div className="envivo-stage__wash pointer-events-none" aria-hidden />
      <div className="envivo-stage__orb envivo-stage__orb--amber pointer-events-none" aria-hidden />
      <div className="envivo-stage__orb envivo-stage__orb--cyan pointer-events-none" aria-hidden />

      <div className="envivo-stage__inner relative z-[1] flex flex-col flex-1 min-h-0 px-1 pt-1 pb-2">
        <EnVivoStageHeader phase={phase} className="mb-1 px-1" />

        {locale ? (
          <motion.div
            className="envivo-stage__locale shrink-0 mb-1 px-1"
            initial={false}
            animate={{ opacity: phase === 'player' ? 1 : 0.35 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            {locale}
          </motion.div>
        ) : null}

        <div className="relative flex-1 flex flex-col min-h-0 min-w-0">
          <EnVivoIntroSplash active={showIntro} />

          <motion.div
            className="envivo-stage__player relative z-[2] flex flex-col flex-1 min-h-0 min-w-0"
            initial={false}
            animate={{
              opacity: phase === 'player' ? 1 : 0.12,
              scale: phase === 'player' ? 1 : 0.9,
            }}
            transition={{ duration: 0.75, ease: EASE_OUT, delay: phase === 'player' ? 0.05 : 0 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
