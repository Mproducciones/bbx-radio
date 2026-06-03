'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { cn } from '@/lib/utils'
import { getDemoAds } from '@/lib/demoCampaigns'
import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'
import { sanitizeAdLink } from '@/lib/safeUrl'

interface Ad {
  _id: string
  nombre: string
  tipo: string
  imagen?: any
  imagenUrl?: string
  enlace?: string
  activo: boolean
  prioridad: number
}

interface RotatingBannerProps {
  interval?: number
  position?: 'top' | 'middle' | 'bottom'
  refreshInterval?: number
  className?: string
}

const TIPO_BY_POSITION = {
  top: 'banner_superior',
  middle: 'banner_intermedio',
  bottom: 'banner_inferior',
} as const

function demoAdsForPosition(position: 'top' | 'middle' | 'bottom'): Ad[] {
  return getDemoAds(TIPO_BY_POSITION[position]).map(d => ({
    _id: d._id,
    nombre: d.nombre,
    tipo: d.tipo,
    imagenUrl: d.imagenUrl,
    enlace: d.enlace,
    activo: d.activo,
    prioridad: d.prioridad,
  }))
}

export function RotatingBanner({ interval = 6, position = 'top', refreshInterval = 30, className }: RotatingBannerProps) {
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
          if (Array.isArray(data) && data.length > 0) setAds(data)
        }
      } catch {}
    }
    load()
    const t = setInterval(load, refreshInterval * 1000)
    return () => clearInterval(t)
  }, [position, refreshInterval])

  const total = ads.length

  useEffect(() => {
    if (total <= 1) return
    const t = setInterval(() => setIndex(p => (p + 1) % total), interval * 1000)
    return () => clearInterval(t)
  }, [total, interval])

  if (total === 0) return null

  const ad = ads[index % total]
  const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : '')
  const placement = `rotating_${position}`
  const link = sanitizeAdLink(ad.enlace)

  return (
    <AdTrackView adId={ad._id} adTipo={ad.tipo} placement={placement} className={cn('w-full', className)}>
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
          {imageUrl
            ? <img src={imageUrl} alt={ad.nombre} className="w-full object-cover rounded-xl" style={{ maxHeight: 180, minHeight: 80 }} />
            : <div className="w-full h-24 flex items-center justify-center bg-[#0F0F1A] rounded-xl"><span className="text-white text-sm">{ad.nombre}</span></div>
          }
          <div className="absolute bottom-2 right-2 text-[9px] text-white/50 bg-black/60 px-2 py-0.5 rounded-full">Publicidad</div>
        </motion.a>
      </AnimatePresence>
    </AdTrackView>
  )
}
