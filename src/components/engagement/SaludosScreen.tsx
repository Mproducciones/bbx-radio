'use client'

import { useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SaludosHook } from '@/components/engagement/SaludosHook'
import type { MotivoId } from '@/lib/saludoTypes'
import { MOTIVOS } from '@/lib/saludoTypes'

const SaludoForm = dynamic(
  () => import('@/components/engagement/SaludoForm').then(m => ({ default: m.SaludoForm })),
  { loading: () => <TabPanelSkeleton lines={4} />, ssr: false },
)

const DEFAULT_ACCENT = '#db8918'

export function SaludosScreen() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT)

  function handleMotivoChange(id: MotivoId) {
    const motivo = MOTIVOS.find(m => m.id === id)
    if (motivo) setAccent(motivo.color)
  }

  return (
    <AppMenuScreen scroll fullWidth className="saludos-route scroll-tab-route w-full min-w-0 max-w-full">
      <SectionHeader
        compact
        letterReveal
        centered
        showLine={false}
        title="Saludos"
        className="min-w-0 max-w-full overflow-x-hidden"
      />
      <div
        className="saludos-route__content scroll-tab-route__content flex flex-col gap-1.5 min-w-0 max-w-full md:gap-5 md:min-h-0 md:flex-1 md:flex md:flex-col"
        style={{ '--saludos-accent': accent } as CSSProperties}
      >
        <SaludosHook />
        <SaludoForm compact onMotivoChange={handleMotivoChange} />
        <RotatingBanner position="bottom" compact className="shrink-0 w-full min-w-0 max-w-full" interval={8} />
      </div>
    </AppMenuScreen>
  )
}
