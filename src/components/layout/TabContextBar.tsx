'use client'

import { motion } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { EASE_OUT } from '@/lib/motion/framer'
import { EnVivoTvButton } from '@/components/tv/EnVivoTvButton'
import { NotificationsInbox } from '@/components/notifications/NotificationsInbox'
import { BbxFrequencyGate } from '@/components/pwa/BbxFrequencyGate'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

/** Barra superior compartida — continuidad entre En Vivo y tabs scroll. */
export function TabContextBar({
  className,
  integrated = true,
}: {
  className?: string
  /** Sin caja ni borde — tipografía flotante */
  integrated?: boolean
}) {
  const { isPlaying } = useRadioPlayerContext()

  return (
    <motion.div
      className={
        integrated
          ? `tab-context-bar tab-context-bar--integrated flex items-center justify-between gap-3 shrink-0 min-w-0 max-w-full px-1 py-2 ${className ?? ''}`
          : `tab-context-bar flex items-center justify-between gap-3 shrink-0 min-w-0 max-w-full rounded-xl px-3 py-2.5 border border-white/[0.07] bg-white/[0.03] ${className ?? ''}`
      }
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          {isPlaying && (
            <span className="tab-context-bar__live-dot shrink-0" aria-hidden title="En vivo" />
          )}
          <h1 className="font-display text-lg text-white leading-none tracking-wide truncate">
            {RADIO.name}
          </h1>
        </div>
        <p className="text-white/40 text-[11px] mt-1 font-medium truncate">{RADIO.slogan}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <EnVivoTvButton />
        <NotificationsInbox />
        <BbxFrequencyGate
          className="font-display text-sm leading-none px-2.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-transform"
          style={{
            color: 'var(--color-mag-400)',
            background: 'color-mix(in srgb, var(--color-mag-400) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-mag-400) 38%, transparent)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {RADIO.frequency}
        </BbxFrequencyGate>
      </div>
    </motion.div>
  )
}
