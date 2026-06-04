'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { SponsorDemoBar } from '@/components/ads/SponsorDemoBar'
import { ParticipaHero } from '@/components/engagement/ParticipaHero'
import { ParticipaActionTabs, type ParticipaTab } from '@/components/engagement/ParticipaActionTabs'
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

const TAB_ORDER: ParticipaTab[] = ['votar', 'pedir', 'sorteo']

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -28 : 28, opacity: 0, scale: 0.98 }),
}

export function ParticipaScreen() {
  const tabs = FEATURES.contests
    ? [...BASE_TABS, { id: 'sorteo' as const, label: 'Sorteo' }]
    : BASE_TABS
  const [tab, setTab] = useState<ParticipaTab>('votar')
  const prevTab = useRef<ParticipaTab>('votar')
  const dir = TAB_ORDER.indexOf(tab) >= TAB_ORDER.indexOf(prevTab.current) ? 1 : -1

  function selectTab(next: ParticipaTab) {
    prevTab.current = tab
    setTab(next)
  }

  return (
    <AppMenuScreen scroll className="participa-route w-full min-w-0 max-w-full">
      <div className="participa-shell relative w-full min-w-0">
        <ParticipaHero />
        <SponsorDemoBar />
        <ParticipaActionTabs tabs={tabs} active={tab} onChange={selectTab} />

        <div className="participa-content w-full min-w-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={tab}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="participa-panel participa-tab-panel flex flex-col w-full min-w-0 max-w-full"
            >
              {tab === 'votar' ? (
                <SongPoll compact className="flex-1 min-h-0 w-full min-w-0" onEmpty={() => selectTab('pedir')} />
              ) : tab === 'pedir' ? (
                <SongRequestForm compact playful className="flex-1 min-h-0" />
              ) : (
                <ListenerSignup className="flex-1 min-h-0" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppMenuScreen>
  )
}
