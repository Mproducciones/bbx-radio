'use client'

import dynamic from 'next/dynamic'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { PremiumAdInline } from '@/components/ads/PremiumAdBanner'
import { SaludosHero } from '@/components/engagement/SaludosHero'

const SaludoForm = dynamic(
  () => import('@/components/engagement/SaludoForm').then(m => ({ default: m.SaludoForm })),
  { loading: () => <TabPanelSkeleton lines={4} />, ssr: false },
)

export function SaludosScreen() {
  return (
    <AppMenuScreen scroll contextBar className="saludos-route w-full min-w-0 max-w-full">
      <div className="saludos-shell w-full min-w-0">
        <SaludosHero />
        <PremiumAdInline />
        <SaludoForm compact />
        <RotatingBanner
          position="bottom"
          compact
          className="saludos-sponsor-banner shrink-0 w-full min-w-0 max-w-full"
          interval={8}
        />
      </div>
    </AppMenuScreen>
  )
}
