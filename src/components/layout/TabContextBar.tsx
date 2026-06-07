'use client'

import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { easeOutQuint } from '@/lib/animations/welcomeCanvas'
import { EnVivoTvButton } from '@/components/tv/EnVivoTvButton'
import { NotificationsInbox } from '@/components/notifications/NotificationsInbox'
import { BbxFrequencyGate } from '@/components/pwa/BbxFrequencyGate'
import { useEnVivoIntroActive } from '@/components/player/EnVivoBootMotion'
import { useBootMorphTick, useBootMorphVinylScale } from '@/hooks/useBootMorphDrive'

/** FM (der) → notif → TV (izq), sincronizado al vinilo. */
const SLOT_ORDER = { fm: 0, notif: 1, tv: 2 } as const
const SLOT_START = [0.08, 0.22, 0.38]

function slotReveal(vinylProgress: number, order: number): number {
  const start = SLOT_START[order] ?? 0
  if (vinylProgress <= start) return 0
  return easeOutQuint(Math.min(1, (vinylProgress - start) / 0.38))
}

function slotScale(t: number): number {
  return 0.55 + t * 0.45
}

function slotOffsetX(order: number, t: number): number {
  const drift = (1 - t) * 28
  if (order === SLOT_ORDER.fm) return drift
  if (order === SLOT_ORDER.tv) return -drift
  return (1 - t) * 8
}

/** Chrome En Vivo — TV izq · notif centro · FM der; visible sobre el boot. */
export function TabContextBar({ className }: { className?: string }) {
  const introActive = useEnVivoIntroActive()
  useBootMorphTick()
  const vinylScale = useBootMorphVinylScale()
  const [portalReady, setPortalReady] = useState(false)

  useLayoutEffect(() => {
    setPortalReady(true)
  }, [])

  const vinylProgress = introActive ? Math.min(1, vinylScale / 0.88) : 1
  const floatChrome = introActive && portalReady

  const slots = [
    {
      key: 'tv',
      align: 'envivo-chrome-grid__slot--tv',
      order: SLOT_ORDER.tv,
      node: <EnVivoTvButton className="envivo-chrome-grid__item" />,
    },
    {
      key: 'notif',
      align: 'envivo-chrome-grid__slot--notif',
      order: SLOT_ORDER.notif,
      node: <NotificationsInbox className="envivo-chrome-grid__item" />,
    },
    {
      key: 'fm',
      align: 'envivo-chrome-grid__slot--fm',
      order: SLOT_ORDER.fm,
      node: (
        <BbxFrequencyGate className="envivo-chrome-grid__fm font-display leading-none shrink-0 active:scale-95 transition-transform">
          {RADIO.frequency}
        </BbxFrequencyGate>
      ),
    },
  ] as const

  const bar = (
    <div
      className={`tab-context-bar envivo-chrome-grid shrink-0 min-w-0 max-w-full ${className ?? ''}`}
      role="toolbar"
      aria-label="Controles En Vivo"
    >
      {slots.map(({ key, align, order, node }) => {
        const t = slotReveal(vinylProgress, order)

        return (
          <motion.div
            key={key}
            className={`envivo-chrome-grid__slot ${align} flex items-center origin-center`}
            initial={false}
            animate={{
              opacity: t,
              scale: slotScale(t),
              x: slotOffsetX(order, t),
            }}
            transition={{ duration: 0 }}
          >
            {node}
          </motion.div>
        )
      })}
    </div>
  )

  if (floatChrome) {
    return (
      <>
        {createPortal(
          <div
            className="envivo-chrome-float fixed inset-x-0 z-[5010] pointer-events-auto box-border"
            style={{
              top: 0,
              paddingTop: 'calc(var(--app-safe-top, 0px) + var(--app-content-pad-y, 0px))',
              paddingLeft: 'var(--app-gutter-left, 0px)',
              paddingRight: 'var(--app-gutter-right, 0px)',
            }}
          >
            {bar}
          </div>,
          document.body,
        )}
        <div className="envivo-chrome-grid__spacer min-h-[2.5rem] shrink-0" aria-hidden />
      </>
    )
  }

  return bar
}
