'use client'

import { motion } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { EASE_OUT } from '@/lib/motion/framer'
import { EnVivoTvButton } from '@/components/tv/EnVivoTvButton'
import { NotificationsInbox } from '@/components/notifications/NotificationsInbox'
import { BbxFrequencyGate } from '@/components/pwa/BbxFrequencyGate'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

type Phase = 'intro' | 'player'

/** Cabecera En Vivo — tipografía limpia, sin caja ni borde. */
export function EnVivoStageHeader({
  phase,
  className,
}: {
  phase: Phase
  className?: string
}) {
  const { isPlaying } = useRadioPlayerContext()

  return (
    <motion.header
      className={`envivo-stage-header shrink-0 min-w-0 ${className ?? ''}`}
      initial={false}
      animate={{
        opacity: phase === 'intro' ? 0 : 1,
        y: phase === 'intro' ? -8 : 0,
      }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay: phase === 'player' ? 0.08 : 0 }}
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            {isPlaying && (
              <span className="envivo-stage-header__live shrink-0" aria-hidden title="En vivo" />
            )}
            <h1 className="font-display text-[1.35rem] leading-none tracking-wide text-white truncate">
              {RADIO.name}
            </h1>
          </div>
          <p className="text-[11px] text-white/42 mt-1.5 font-medium truncate leading-snug">
            {RADIO.slogan}
          </p>
          <p className="text-[10px] text-white/28 mt-0.5 truncate">{RADIO.city}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <EnVivoTvButton />
          <NotificationsInbox />
          <BbxFrequencyGate
            className="font-display text-xs leading-none px-2 py-1 rounded-full shrink-0 active:scale-95 transition-transform envivo-stage-header__fm"
          >
            {RADIO.frequency}
          </BbxFrequencyGate>
        </div>
      </div>
    </motion.header>
  )
}
