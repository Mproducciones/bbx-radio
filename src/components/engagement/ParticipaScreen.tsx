'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SongPoll } from '@/components/engagement/SongPoll'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { ListenerSignup } from '@/components/engagement/ListenerSignup'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { ProgrammaticAdSlot } from '@/components/ads/ProgrammaticAdSlot'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { FEATURES } from '@/lib/plan'

type Tab = 'votar' | 'pedir' | 'sorteo'

const ICONS: Record<Tab, string> = {
  votar:  '🎵',
  pedir:  '🎙️',
  sorteo: '🎁',
}

const BASE_TABS: { id: Tab; label: string }[] = [
  { id: 'votar', label: 'Votar' },
  { id: 'pedir', label: 'Pedir canción' },
]

const ACCENT = '#db8918'

export function ParticipaScreen() {
  const tabs = FEATURES.contests
    ? [...BASE_TABS, { id: 'sorteo' as const, label: 'Sorteo' }]
    : BASE_TABS
  const [tab, setTab] = useState<Tab>('votar')

  return (
    <AppMenuScreen>
      <div className="flex flex-col flex-1 min-h-0">
        <SectionHeader compact title="Participá" />

        {/* Tab bar with sliding pill */}
        <div
          className="flex shrink-0 gap-1 p-1 rounded-2xl mb-3 relative"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          role="tablist"
          aria-label="Participación"
        >
          {tabs.map(({ id, label }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors relative z-[1] flex items-center justify-center gap-1.5"
                style={{ color: active ? '#07070e' : 'rgba(255,255,255,0.40)' }}
              >
                {/* Animated pill background */}
                {active && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-xl z-[-1]"
                    style={{ background: ACCENT }}
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="text-sm">{ICONS[id]}</span>
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab content with slide transition */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col pb-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 min-h-0 flex flex-col"
            >
              {tab === 'votar' ? (
                <SongPoll compact className="flex-1 min-h-0" onEmpty={() => setTab('pedir')} />
              ) : tab === 'pedir' ? (
                <SongRequestForm compact />
              ) : (
                <ListenerSignup />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <RotatingBanner position="middle" className="hidden md:block mt-5 shrink-0" />
        <ProgrammaticAdSlot className="mt-3 shrink-0 hidden md:block" />
      </div>
    </AppMenuScreen>
  )
}
