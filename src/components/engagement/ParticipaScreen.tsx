'use client'

import { useRef, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'
import { SponsorDemoBar } from '@/components/ads/SponsorDemoBar'
import { PremiumAdInline } from '@/components/ads/PremiumAdBanner'
import { ParticipaHero } from '@/components/engagement/ParticipaHero'
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
  enter: { opacity: 0, y: 14, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
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
    <AppMenuScreen scroll fullWidth className="participa-route w-full min-w-0 max-w-full">
      <div
        className="participa-arena w-full min-w-0 max-w-full"
        style={{ '--participa-accent': tabMeta.color } as CSSProperties}
      >
        <div className="participa-arena__fx" aria-hidden>
          <div className="participa-arena__mesh" />
          <div className="participa-arena__scan" />
          <motion.div
            className="participa-arena__pulse"
            animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.28, 0.12] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="participa-arena__body">
          <SponsorDemoBar />
          <ParticipaHero />
          <ParticipaActionTabs tabs={tabs} active={tab} onChange={selectTab} />
          <PremiumAdInline />

          <div className="participa-stage w-full min-w-0 max-w-full">
            <div className="participa-stage__ring" aria-hidden />
            <div className="participa-content w-full min-w-0 max-w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 340, damping: 28 }}
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
          </div>
        </div>
      </div>
    </AppMenuScreen>
  )
}
