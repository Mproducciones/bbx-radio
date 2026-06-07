'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'
import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'
import { AdBannerVisual } from '@/components/ads/AdBannerVisual'
import { AdRadioStamp } from '@/components/ads/AdRadioStamp'
import { sanitizeAdLink } from '@/lib/safeUrl'
import { FEATURES } from '@/lib/plan'
import { isExclusiveCampaign } from '@/lib/adExclusivity'
import {
  EN_VIVO_AD_SCHEDULE,
  resolveEnVivoAdMode,
  type EnVivoAdMode,
} from '@/lib/enVivoAdSchedule'
import {
  enVivoNoRotation,
  loadEnVivoAdsClient,
  pickEnVivoFromApiRows,
  type EnVivoSlotMode,
} from '@/lib/enVivoAds'
import { readSponsorDemoTier, SPONSOR_DEMO_CHANGE_EVENT } from '@/lib/sponsorAdTiers'
import type { DemoAd } from '@/lib/demoCampaigns'

type Ad = DemoAd & { imagen?: unknown }

const SLOT_HEIGHT = 72

/** Banner en En Vivo por intervalos — respeta plan demo y plan comercial. */
export function EnVivoAdSlot({ className }: { className?: string }) {
  const [slotMode, setSlotMode] = useState<EnVivoSlotMode>('standard')
  const [ads, setAds] = useState<Ad[]>([])
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [demoEpoch, setDemoEpoch] = useState(0)

  const reloadDemo = useCallback(() => setDemoEpoch(n => n + 1), [])

  useEffect(() => {
    const onDemo = () => reloadDemo()
    window.addEventListener(SPONSOR_DEMO_CHANGE_EVENT, onDemo)
    return () => window.removeEventListener(SPONSOR_DEMO_CHANGE_EVENT, onDemo)
  }, [reloadDemo])

  useEffect(() => {
    if (!FEATURES.publicidad) return

    const tier = readSponsorDemoTier()
    const clientFallback = loadEnVivoAdsClient()
    setSlotMode(clientFallback.slotMode)
    setAds(clientFallback.ads)
    setIndex(0)

    async function load() {
      try {
        const [premRes, infRes] = await Promise.all([
          fetch('/api/ads?tipo=banner_premium'),
          fetch('/api/ads?tipo=banner_inferior'),
        ])
        const premium = premRes.ok ? await premRes.json() : []
        const inferior = infRes.ok ? await infRes.json() : []
        const picked = pickEnVivoFromApiRows(
          Array.isArray(premium) ? premium : [],
          Array.isArray(inferior) ? inferior : [],
          tier,
        )

        if (picked.ads.length > 0) {
          setSlotMode(picked.slotMode)
          setAds(picked.ads)
          setIndex(0)
        } else if (clientFallback.ads.length > 0) {
          setSlotMode(clientFallback.slotMode)
          setAds(clientFallback.ads)
        }
      } catch {
        if (clientFallback.ads.length > 0) {
          setSlotMode(clientFallback.slotMode)
          setAds(clientFallback.ads)
        }
      } finally {
        setLoaded(true)
      }
    }

    setLoaded(false)
    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [demoEpoch])

  const total = ads.length
  const ad = useMemo(() => (total > 0 ? ads[index % total] : null), [ads, index, total])
  const isExclusive = ad ? isExclusiveCampaign(ad) : false
  const scheduleMode: EnVivoAdMode = resolveEnVivoAdMode(slotMode, isExclusive)
  const schedule = EN_VIVO_AD_SCHEDULE[scheduleMode]
  const noRotation = useMemo(() => enVivoNoRotation(ads), [ads])

  useEffect(() => {
    if (!loaded || !ad) {
      setVisible(false)
      return
    }

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout>

    const step = (show: boolean) => {
      if (cancelled) return
      setVisible(show)
      timeout = setTimeout(() => step(!show), show ? schedule.displayMs : schedule.pauseMs)
    }

    timeout = setTimeout(() => step(true), schedule.initialDelayMs)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [loaded, ad?._id, schedule.displayMs, schedule.pauseMs, schedule.initialDelayMs])

  useEffect(() => {
    if (!visible || noRotation) return
    const t = setInterval(() => setIndex(p => (p + 1) % total), schedule.rotateMs)
    return () => clearInterval(t)
  }, [visible, noRotation, total, schedule.rotateMs])

  if (!FEATURES.publicidad) return null
  if (!loaded || !ad) return null

  const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : undefined)
  const link = sanitizeAdLink(ad.enlace)
  const accent = ad.colorAccent ?? '#db8918'
  const isHighlighted = slotMode === 'highlighted'
  const badgeLabel = isExclusive ? 'Exclusivo' : isHighlighted ? 'Destacado' : null

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <AdTrackView
          key="envivo-ad-track"
          adId={ad._id}
          adTipo={ad.tipo}
          placement="en_vivo_below_play"
          className={cn('envivo-ad-slot w-full shrink-0 mt-2', className)}
        >
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: SLOT_HEIGHT }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full min-w-0 max-w-full overflow-hidden"
            style={{ minHeight: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.a
                key={ad._id}
                href={link ?? '#'}
                target={link?.startsWith('http') ? '_blank' : undefined}
                rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={() => trackAdClick(ad._id, ad.tipo, 'en_vivo_below_play')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'absolute inset-0 block overflow-hidden rounded-xl',
                  isHighlighted && 'ring-1',
                )}
                style={
                  isHighlighted
                    ? {
                        boxShadow: `0 8px 28px -8px color-mix(in srgb, ${accent} 45%, transparent)`,
                        borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`,
                      }
                    : undefined
                }
              >
                {badgeLabel && (
                  <span
                    className="absolute top-1.5 right-1.5 z-10 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md"
                    style={{ background: accent, color: '#07070e' }}
                  >
                    {badgeLabel}
                  </span>
                )}
                <AdBannerVisual
                  ad={{ ...ad, imagenUrl: imageUrl }}
                  minHeight={SLOT_HEIGHT}
                  maxHeight={SLOT_HEIGHT}
                  highlighted={isHighlighted}
                />
                <AdRadioStamp compact />
              </motion.a>
            </AnimatePresence>
          </motion.div>
        </AdTrackView>
      )}
    </AnimatePresence>
  )
}
