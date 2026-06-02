'use client'

import { useState } from 'react'
import { SongPoll } from '@/components/engagement/SongPoll'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { cn } from '@/lib/utils'

type Tab = 'votar' | 'pedir'

export function ParticipaScreen() {
  const [tab, setTab] = useState<Tab>('votar')

  return (
    <AppMenuScreen>
      <div className="flex flex-col flex-1 min-h-0">
        <SectionHeader
          compact
          kicker="Tu voz en la radio"
          title="Participá"
          subtitle="Votá o pedí canciones al locutor"
        />

        <div
          className="flex shrink-0 gap-1 p-1 rounded-2xl mb-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          role="tablist"
          aria-label="Participación"
        >
          {([
            ['votar', 'Votar'],
            ['pedir', 'Pedir canción'],
          ] as const).map(([id, label]) => {
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

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {tab === 'votar' ? (
            <SongPoll compact onEmpty={() => setTab('pedir')} />
          ) : (
            <SongRequestForm compact />
          )}
        </div>

        <RotatingBanner position="middle" className="hidden md:block mt-5 shrink-0" />
      </div>
    </AppMenuScreen>
  )
}
