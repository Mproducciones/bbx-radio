'use client'

import { useRef, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SponsorDemoBar } from '@/components/ads/SponsorDemoBar'
import { ParticipaHook } from '@/components/engagement/ParticipaHook'
import { ParticipaActionTabs, type ParticipaTab } from '@/components/engagement/ParticipaActionTabs'
import { PARTICIPA_ACTIONS } from '@/lib/participaCopy'
import { FEATURES } from '@/lib/plan'

const SongPoll = dynamic(
  () => import('@/components/engagement/SongPoll').then(m => ({ default: m.SongPoll })),
  { loading: () => <TabPanelSkeleton />, ssr: false },
)

const SongRequestForm = dynamic(
  () => import('@/components/solicitudes/SongRequestForm').then(m => ({ default: m.SongRequestForm })),
  { loading: () => <TabPanelSkeleton />, ssr: false },
)

const ListenerSignup = dynamic(
  () => import('@/components/engagement/ListenerSignup').then(m => ({ default: m.ListenerSignup })),
  { loading: () => <TabPanelSkeleton />, ssr: false },
)

const BASE_TABS: { id: ParticipaTab; label: string }[] = [
  { id: 'votar', label: 'Votar' },
  { id: 'pedir', label: 'Pedir' },
]

const panelVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export function ParticipaScreen() {
  const tabs = FEATURES.contests
    ? [...BASE_TABS, { id: 'sorteo' as const, label: 'Sorteo' }]
    : BASE_TABS
  const [tab, setTab] = useState<ParticipaTab>('votar')
  const prevTab = useRef<ParticipaTab>('votar')

  function selectTab(next: ParticipaTab) {
    prevTab.current = tab
    setTab(next)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8)
    }
  }

  const tabMeta = PARTICIPA_ACTIONS[tab]

  return (
    <AppMenuScreen scroll fullWidth className="participa-route scroll-tab-route w-full min-w-0 max-w-full">
      <SectionHeader
        compact
        letterReveal
        centered
        showLine={false}
        accent={tabMeta.color}
        title="Participa"
        className="min-w-0 max-w-full overflow-x-hidden"
      />
      <div
        className="participa-route__content scroll-tab-route__content flex flex-col gap-1.5 min-w-0 max-w-full md:gap-5 md:min-h-0 md:flex-1 md:flex md:flex-col"
        style={{ '--participa-accent': tabMeta.color } as CSSProperties}
      >
        <SponsorDemoBar />
        <ParticipaHook accent={tabMeta.color} />
        <ParticipaActionTabs tabs={tabs} active={tab} onChange={selectTab} />

        <div className="participa-content w-full min-w-0 max-w-full flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="participa-panel participa-tab-panel flex flex-col w-full min-w-0 max-w-full overflow-x-hidden"
            >
              {tab === 'votar' ? (
                <SongPoll compact className="w-full min-w-0 max-w-full" onEmpty={() => selectTab('pedir')} />
              ) : tab === 'pedir' ? (
                <SongRequestForm compact playful className="w-full min-w-0 max-w-full" />
              ) : (
                <ListenerSignup className="w-full min-w-0 max-w-full" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <RotatingBanner position="bottom" compact className="shrink-0 w-full min-w-0 max-w-full" interval={8} />
      </div>
    </AppMenuScreen>
  )
}
