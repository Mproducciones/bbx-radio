'use client'

import { useState } from 'react'
import { SongPoll } from '@/components/engagement/SongPoll'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { ListenerSignup } from '@/components/engagement/ListenerSignup'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { ProgrammaticAdSlot } from '@/components/ads/ProgrammaticAdSlot'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { FEATURES } from '@/lib/plan'
import { cn } from '@/lib/utils'

type Tab = 'votar' | 'pedir' | 'sorteo'

const BASE_TABS: { id: Tab; label: string }[] = [
  { id: 'votar', label: 'Votar' },
  { id: 'pedir', label: 'Pedir canción' },
]

export function ParticipaScreen() {
  const tabs = FEATURES.contests
    ? [...BASE_TABS, { id: 'sorteo' as const, label: 'Sorteo' }]
    : BASE_TABS
  const [tab, setTab] = useState<Tab>('votar')

  return (
    <AppMenuScreen>
      <div className="flex flex-col flex-1 min-h-0">
        <SectionHeader compact title="Participá" />

        <div
          className="flex shrink-0 gap-1 p-1 rounded-2xl mb-2"
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
                className={cn(
                  'flex-1 py-2 rounded-xl text-xs font-bold transition-colors',
                  active ? 'text-white' : 'text-white/40',
                )}
                style={active ? { background: 'var(--color-mag-400)' } : undefined}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col pb-1">
          {tab === 'votar' ? (
            <SongPoll compact className="flex-1 min-h-0" onEmpty={() => setTab('pedir')} />
          ) : tab === 'pedir' ? (
            <SongRequestForm compact />
          ) : (
            <ListenerSignup />
          )}
        </div>

        <RotatingBanner position="middle" className="hidden md:block mt-5 shrink-0" />
        <ProgrammaticAdSlot className="mt-3 shrink-0 hidden md:block" />
      </div>
    </AppMenuScreen>
  )
}
