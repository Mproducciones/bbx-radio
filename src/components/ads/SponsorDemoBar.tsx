'use client'

import { useEffect, useState } from 'react'
import {
  clearSponsorDemoTier,
  getTierPreview,
  readSponsorDemoTier,
  SPONSOR_DEMO_CHANGE_EVENT,
  type SponsorAdTierId,
} from '@/lib/sponsorAdTiers'
import { RADIO_AD } from '@/lib/radioAdBranding'

export function SponsorDemoBar({ className }: { className?: string }) {
  const [tier, setTier] = useState<SponsorAdTierId | null>(null)

  useEffect(() => {
    const sync = () => setTier(readSponsorDemoTier())
    sync()
    window.addEventListener(SPONSOR_DEMO_CHANGE_EVENT, sync)
    return () => window.removeEventListener(SPONSOR_DEMO_CHANGE_EVENT, sync)
  }, [])

  if (!tier) return null

  const p = getTierPreview(tier)

  return (
    <div
      className={`participa-demo-chip shrink-0 w-full min-w-0 max-w-full box-border ${className ?? ''}`}
      style={{
        color: p.color,
        background: `color-mix(in srgb, ${p.color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${p.color} 32%, transparent)`,
      }}
    >
      <span className="truncate min-w-0">
        Demo · {p.nombre} · {RADIO_AD.frequency}
      </span>
      <button
        type="button"
        onClick={() => {
          clearSponsorDemoTier()
          document.cookie = 'pulso_sponsor_demo_tier=;path=/;max-age=0'
          setTier(null)
        }}
        className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold text-white/70 border border-white/12 bg-black/25"
      >
        Salir
      </button>
    </div>
  )
}
