'use client'

import dynamic from 'next/dynamic'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SaludosHero } from '@/components/engagement/SaludosHero'

const SaludoForm = dynamic(
  () => import('@/components/engagement/SaludoForm').then(m => ({ default: m.SaludoForm })),
  { loading: () => <TabPanelSkeleton lines={4} />, ssr: false },
)

export function SaludosScreen() {
  return (
    <AppMenuScreen className="saludos-route">
      <div className="saludos-shell">
        <SaludosHero />
        <SaludoForm compact />
        <RotatingBanner position="bottom" compact className="shrink-0" interval={8} />
      </div>
    </AppMenuScreen>
  )
}
