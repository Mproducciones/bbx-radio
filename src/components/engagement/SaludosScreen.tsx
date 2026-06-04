'use client'

import dynamic from 'next/dynamic'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { RotatingBanner } from '@/components/ads/RotatingBanner'

const SaludoForm = dynamic(
  () => import('@/components/engagement/SaludoForm').then(m => ({ default: m.SaludoForm })),
  { loading: () => <TabPanelSkeleton lines={4} />, ssr: false },
)

export function SaludosScreen() {
  return (
    <AppMenuScreen>
      <div className="flex flex-col flex-1 min-h-0">
        <SectionHeader compact title="Saludos al Aire" />
        <SaludoForm compact />
        <RotatingBanner position="bottom" compact className="mt-2 shrink-0" interval={8} />
      </div>
    </AppMenuScreen>
  )
}
