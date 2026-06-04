'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'
import { getDemoAds } from '@/lib/demoCampaigns'
import { demoAdsForSponsorTier, readSponsorDemoTier } from '@/lib/sponsorAdTiers'
import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'
import { AdBannerVisual } from '@/components/ads/AdBannerVisual'
import { AdRadioStamp } from '@/components/ads/AdRadioStamp'
import { sanitizeAdLink } from '@/lib/safeUrl'
import { isExclusiveCampaign } from '@/lib/adExclusivity'

interface Ad {
  _id: string
  nombre: string
  cliente?: string
  tipo: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagen?: any
  imagenUrl?: string
  enlace?: string
  activo: boolean
  prioridad: number
  planContratado?: string
  exclusivoApp?: boolean
}

interface RotatingBannerProps {
  interval?: number
  position?: 'top' | 'middle' | 'bottom'
  refreshInterval?: number
  className?: string
  compact?: boolean
}

const TIPO_BY_POSITION = {
  top: 'banner_superior',
  middle: 'banner_intermedio',
  bottom: 'banner_inferior',
} as const

function demoAdsForPosition(position: 'top' | 'middle' | 'bottom'): Ad[] {
  const tier = readSponsorDemoTier()
  const overrides = tier ? demoAdsForSponsorTier(tier) : undefined
  return getDemoAds(TIPO_BY_POSITION[position], overrides).map(d => ({
    _id: d._id,
    nombre: d.nombre,
    cliente: d.cliente,
    tipo: d.tipo,
    tagline: d.tagline,
    cta: d.cta,
    colorAccent: d.colorAccent,
    imagenUrl: d.imagenUrl,
    enlace: d.enlace,
    activo: d.activo,
    prioridad: d.prioridad,
  }))
}

export function RotatingBanner({
  interval = 6,
  position = 'top',
  refreshInterval = 30,
  className,
  compact = false,
}: RotatingBannerProps) {
  const initialAds = useMemo(() => demoAdsForPosition(position), [position])
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setAds(demoAdsForPosition(position))
    setIndex(0)
  }, [position])

  useEffect(() => {
    const load = async () => {
      try {
        const tipo = TIPO_BY_POSITION[position]
        const res = await fetch(`/api/ads?tipo=${encodeURIComponent(tipo)}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const hasImage = data.some((a: Ad) => a.imagenUrl || a.imagen)
            if (hasImage) setAds(data)
          }
        }
      } catch {}
    }
    load()
    const t = setInterval(load, refreshInterval * 1000)
    return () => clearInterval(t)
  }, [position, refreshInterval])

  const total = ads.length
  const noRotation = total <= 1 || ads.some(a => isExclusiveCampaign(a))

  useEffect(() => {
    if (noRotation) return
    const t = setInterval(() => setIndex(p => (p + 1) % total), interval * 1000)
    return () => clearInterval(t)
  }, [noRotation, total, interval])

  if (total === 0) return null

  const ad = ads[index % total]
  const showExclusiveBadge = isExclusiveCampaign(ad)
  const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : undefined)
  const placement = `rotating_${position}`
  const link = sanitizeAdLink(ad.enlace)
  const minH = compact ? 64 : 80
  const maxH = compact ? 120 : 180

  return (
    <AdTrackView adId={ad._id} adTipo={ad.tipo} placement={placement} className={cn('w-full shrink-0', className)}>
      <AnimatePresence mode="wait">
        <motion.a
          key={ad._id}
          href={link ?? '#'}
          target={link?.startsWith('http') ? '_blank' : undefined}
          rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={() => trackAdClick(ad._id, ad.tipo, placement)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative block overflow-hidden rounded-xl"
        >
          {showExclusiveBadge && (
            <span
              className="absolute top-1.5 right-1.5 z-10 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md"
              style={{
                background: ad.colorAccent ?? '#7D59B5',
                color: '#07070e',
              }}
            >
              Exclusivo
            </span>
          )}
          <AdBannerVisual
            ad={{ ...ad, imagenUrl: imageUrl }}
            minHeight={minH}
            maxHeight={maxH}
          />
          <AdRadioStamp compact={compact} />
        </motion.a>
      </AnimatePresence>
    </AdTrackView>
  )
}
