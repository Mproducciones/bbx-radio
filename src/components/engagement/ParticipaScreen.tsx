'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { PremiumAdInline } from '@/components/ads/PremiumAdBanner'
import { SponsorDemoBar } from '@/components/ads/SponsorDemoBar'
import { ParticipaHook } from '@/components/engagement/ParticipaHook'
import { ParticipaActionTabs, type ParticipaTab } from '@/components/engagement/ParticipaActionTabs'
import { SongPoll } from '@/components/engagement/SongPoll'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { PARTICIPA_ACTIONS } from '@/lib/participaCopy'
import { FEATURES } from '@/lib/plan'
import { prefetchActiveContest } from '@/lib/sorteoDefaults'

const ListenerSignup = dynamic(
  () => import('@/components/engagement/ListenerSignup').then(m => ({ default: m.ListenerSignup })),
  { ssr: false },
)

const BASE_TABS: { id: ParticipaTab; label: string }[] = [
  { id: 'votar', label: 'Votar' },
  { id: 'pedir', label: 'Pedir' },
]

const panelVariants = {
  enter: { opacity: 0, y: 6 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

export function ParticipaScreen() {
  const tabs = FEATURES.contests
    ? [...BASE_TABS, { id: 'sorteo' as const, label: 'Sorteo' }]
    : BASE_TABS
  const [tab, setTab] = useState<ParticipaTab>('votar')
  const prevTab = useRef<ParticipaTab>('votar')

  useEffect(() => {
    if (!FEATURES.contests) return
    prefetchActiveContest()
    void import('@/components/engagement/ListenerSignup')
  }, [])

  function selectTab(next: ParticipaTab) {
    prevTab.current = tab
    setTab(next)
    if (next === 'sorteo') prefetchActiveContest()
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
        <PremiumAdInline />
        <RotatingBanner position="middle" compact className="shrink-0 w-full min-w-0 max-w-full" interval={8} />

        <div className="participa-content w-full min-w-0 max-w-full flex-1 min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
    </AppMenuScreen>
  )
}
