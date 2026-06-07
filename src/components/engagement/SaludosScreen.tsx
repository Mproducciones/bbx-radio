'use client'

import { useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { PremiumAdInline } from '@/components/ads/PremiumAdBanner'
import { SaludosHero } from '@/components/engagement/SaludosHero'
import { SaludosOnAirTicker } from '@/components/engagement/SaludosOnAirTicker'
import type { MotivoId } from '@/lib/saludoTypes'
import { MOTIVOS } from '@/lib/saludoTypes'

const SaludoForm = dynamic(
  () => import('@/components/engagement/SaludoForm').then(m => ({ default: m.SaludoForm })),
  { loading: () => <TabPanelSkeleton lines={4} />, ssr: false },
)

const FLOATIES = ['❤️', '🎂', '👋', '📻', '✨', '💌']

const DEFAULT_ACCENT = '#db8918'

export function SaludosScreen() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT)

  function handleMotivoChange(id: MotivoId) {
    const motivo = MOTIVOS.find(m => m.id === id)
    if (motivo) setAccent(motivo.color)
  }

  return (
    <AppMenuScreen scroll fullWidth className="saludos-route w-full min-w-0 max-w-full">
      <div
        className="saludos-arena w-full min-w-0 max-w-full"
        style={{ '--saludos-accent': accent } as CSSProperties}
      >
        <div className="saludos-arena__fx" aria-hidden>
          <div className="saludos-arena__mesh" />
          {FLOATIES.map((emoji, i) => (
            <motion.span
              key={emoji}
              className="saludos-floatie"
              style={{ left: `${8 + i * 15}%`, top: `${12 + (i % 3) * 22}%` }}
              animate={{
                y: [0, -12, 0],
                opacity: [0.12, 0.35, 0.12],
                rotate: [-6, 6, -6],
              }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            >
              {emoji}
            </motion.span>
          ))}
          <motion.div
            className="saludos-arena__glow saludos-arena__glow--a"
            animate={{ scale: [1, 1.2, 1], opacity: [0.16, 0.32, 0.16] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="saludos-arena__glow saludos-arena__glow--b"
            animate={{ scale: [1, 1.14, 1], opacity: [0.12, 0.26, 0.12] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
        </div>

        <div className="saludos-arena__body">
          <SaludosOnAirTicker />
          <SaludosHero />
          <PremiumAdInline />

          <div className="saludos-stage w-full min-w-0 max-w-full">
            <div className="saludos-stage__ring" aria-hidden />
            <SaludoForm compact onMotivoChange={handleMotivoChange} />
          </div>

          <RotatingBanner
            position="bottom"
            compact
            className="saludos-sponsor-banner shrink-0 w-full min-w-0 max-w-full"
            interval={8}
          />
        </div>
      </div>
    </AppMenuScreen>
  )
}
