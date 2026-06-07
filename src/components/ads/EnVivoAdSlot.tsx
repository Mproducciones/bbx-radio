'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'
import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'
import { AdBannerVisual } from '@/components/ads/AdBannerVisual'
import { AdRadioStamp } from '@/components/ads/AdRadioStamp'
import { sanitizeAdLink } from '@/lib/safeUrl'
import { FEATURES } from '@/lib/plan'
import { isExclusiveCampaign } from '@/lib/adExclusivity'

type Ad = {
  _id: string
  nombre: string
  cliente?: string
  tipo: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
  imagen?: unknown
  enlace?: string
  planContratado?: string
  exclusivoApp?: boolean
  prioridad?: number
}

type Mode = 'highlighted' | 'standard'

/** Banner bajo el play en En Vivo — cumple planes Básico (inferior) y Premium/Empresarial (destacado). */
export function EnVivoAdSlot({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('standard')
  const [ads, setAds] = useState<Ad[]>([])
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!FEATURES.publicidad) return

    async function load() {
      try {
        const [premRes, infRes] = await Promise.all([
          fetch('/api/ads?tipo=banner_premium'),
          fetch('/api/ads?tipo=banner_inferior'),
        ])
        const premium: Ad[] = premRes.ok ? await premRes.json() : []
        const inferior: Ad[] = infRes.ok ? await infRes.json() : []

        const highlight = premium.filter(a => a.imagenUrl || a.imagen)
        if (highlight.length > 0) {
          setMode('highlighted')
          setAds(highlight)
          setIndex(0)
          return
        }

        const standard = inferior.filter(a => a.imagenUrl || a.imagen)
        if (standard.length > 0) {
          setMode('standard')
          setAds(standard)
          setIndex(0)
        }
      } catch {
        /* keep empty */
      } finally {
        setLoaded(true)
      }
    }

    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [])

  const total = ads.length
  const noRotation = useMemo(
    () => total <= 1 || ads.some(a => isExclusiveCampaign(a)),
    [ads, total],
  )

  useEffect(() => {
    if (noRotation) return
    const t = setInterval(() => setIndex(p => (p + 1) % total), 8_000)
    return () => clearInterval(t)
  }, [noRotation, total])

  const ad = useMemo(() => (total > 0 ? ads[index % total] : null), [ads, index, total])
  const slotHeight = 72

  if (!FEATURES.publicidad) return null
  if (loaded && !ad) return null
  if (!ad) {
    return (
      <div
        className={cn('envivo-ad-slot envivo-ad-slot--reserved w-full shrink-0', className)}
        aria-hidden
      />
    )
  }

  const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : undefined)
  const link = sanitizeAdLink(ad.enlace)
  const accent = ad.colorAccent ?? '#db8918'
  const isHighlighted = mode === 'highlighted'
  const isExclusive = ad ? isExclusiveCampaign(ad) : false
  const badgeLabel = isExclusive ? 'Exclusivo' : isHighlighted ? 'Destacado' : null

  return (
    <AdTrackView
      adId={ad._id}
      adTipo={ad.tipo}
      placement="en_vivo_below_play"
      className={cn('envivo-ad-slot w-full shrink-0 mt-2', className)}
    >
      <div
        className="relative w-full min-w-0 max-w-full overflow-hidden rounded-xl"
        style={{ height: slotHeight, minHeight: slotHeight, maxHeight: slotHeight }}
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
            transition={{ duration: 0.3 }}
            className={cn('absolute inset-0 block overflow-hidden rounded-xl', isHighlighted && 'ring-1')}
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
            minHeight={slotHeight}
            maxHeight={slotHeight}
            highlighted={isHighlighted}
          />
          <AdRadioStamp compact />
        </motion.a>
      </AnimatePresence>
      </div>
    </AdTrackView>
  )
}
