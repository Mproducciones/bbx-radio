'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'

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
}

// Anuncios simulados con imágenes reales (picsum.photos — seed consistente)
const MOCK_ADS = {
  top: [
    {
      label:   'Supermercado El Ahorro',
      sub:     'Las mejores ofertas · Rancagua centro',
      cta:     'Ver ofertas',
      href:    '#',
      image:   'https://picsum.photos/seed/superahorro/800/180',
      accent:  '#7D59B5',
      badge:   'OFERTA SEMANA',
    },
    {
      label:   'AutoMundo Rancagua',
      sub:     'Tu próximo auto te está esperando',
      cta:     'Ver catálogo',
      href:    '#',
      image:   'https://picsum.photos/seed/automundo/800/180',
      accent:  '#40B9BF',
      badge:   'NUEVO MODELO',
    },
    {
      label:   'Clínica Bienvenida',
      sub:     'Agenda tu hora hoy · Atención inmediata',
      cta:     'Agendar',
      href:    '#',
      image:   'https://picsum.photos/seed/clinica2024/800/180',
      accent:  '#db8918',
      badge:   'SALUD',
    },
  ],
  middle: [
    {
      label:   'Constructora Del Valle',
      sub:     "Tu casa soñada en O'Higgins",
      cta:     'Cotizar',
      href:    '#',
      image:   'https://picsum.photos/seed/constructora/800/180',
      accent:  '#db8918',
      badge:   'PROYECTO',
    },
    {
      label:   'Pizza Italiana · Delivery',
      sub:     'Delivery a todo Rancagua en 30 min',
      cta:     'Pedir ahora',
      href:    '#',
      image:   'https://picsum.photos/seed/pizza2024/800/180',
      accent:  '#FF8C42',
      badge:   'DELIVERY',
    },
    {
      label:   'Farmacia Cruz Verde',
      sub:     'Medicamentos · Bioequivalentes · Perfumería',
      cta:     'Ver local',
      href:    '#',
      image:   'https://picsum.photos/seed/farmacia/800/180',
      accent:  '#40B9BF',
      badge:   'SALUD',
    },
  ],
  bottom: [
    {
      label:   '¿Quieres llegar a Rancagua?',
      sub:     'Pauta en Radio Bienvenida 93.3 FM',
      cta:     'Contactar',
      href:    'https://wa.me/56950291592',
      image:   'https://picsum.photos/seed/radiobienvenida/800/180',
      accent:  '#db8918',
      badge:   'PAUTA AQUÍ',
    },
    {
      label:   "Instituto O'Higgins",
      sub:     'Carreras técnicas · Matrícula abierta 2025',
      cta:     'Informarme',
      href:    '#',
      image:   'https://picsum.photos/seed/instituto/800/180',
      accent:  '#40B9BF',
      badge:   'EDUCACIÓN',
    },
    {
      label:   'BancoEstado',
      sub:     'Créditos para tu negocio sin papeleos',
      cta:     'Simular',
      href:    '#',
      image:   'https://picsum.photos/seed/bancoestado/800/180',
      accent:  '#7D59B5',
      badge:   'FINANZAS',
    },
  ],
} as const

export function RotatingBanner({ interval = 6, position = 'top', refreshInterval = 30 }: RotatingBannerProps) {
  const [ads, setAds]     = useState<Ad[]>([])
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const tipoMap = { top: 'banner_superior', middle: 'banner_intermedio', bottom: 'banner_inferior' }
        const res = await fetch(`/api/ads?tipo=${encodeURIComponent(tipoMap[position])}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) setAds(data)
        }
      } catch {}
      setReady(true)
    }
    load()
    const t = setInterval(load, refreshInterval * 1000)
    return () => clearInterval(t)
  }, [position, refreshInterval])

  const mocks = MOCK_ADS[position]
  const total = ads.length > 0 ? ads.length : mocks.length

  useEffect(() => {
    if (total <= 1) return
    const t = setInterval(() => setIndex(p => (p + 1) % total), interval * 1000)
    return () => clearInterval(t)
  }, [total, interval])

  if (!ready) return null

  /* ── Anuncios reales de Sanity ── */
  if (ads.length > 0) {
    const ad = ads[index % ads.length]
    const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : '')
    return (
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.a
            key={ad._id}
            href={ad.enlace || '#'}
            target={ad.enlace ? '_blank' : undefined}
            rel={ad.enlace ? 'noopener noreferrer' : undefined}
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
      </div>
    )
  }

  /* ── Mocks con imagen + overlay ── */
  const m = mocks[index % mocks.length]
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.a
          key={index}
          href={m.href}
          target={m.href !== '#' ? '_blank' : undefined}
          rel={m.href !== '#' ? 'noopener noreferrer' : undefined}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.4 }}
          className="relative block overflow-hidden rounded-xl"
          style={{ border: `1px solid ${m.accent}25` }}
        >
          {/* Imagen de fondo */}
          <div className="relative h-[100px]">
            <img
              src={m.image}
              alt={m.label}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay oscuro + color tint */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(100deg, rgba(7,7,14,0.90) 0%, rgba(7,7,14,0.65) 55%, rgba(7,7,14,0.3) 100%)` }}
            />
            {/* Accent line top */}
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${m.accent}, transparent)` }} />

            {/* Contenido */}
            <div className="absolute inset-0 flex items-center px-4 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: m.accent, background: `${m.accent}25`, border: `1px solid ${m.accent}40` }}
                  >
                    {m.badge}
                  </span>
                </div>
                <p className="text-white font-bold text-sm leading-tight truncate drop-shadow-sm">{m.label}</p>
                <p className="text-white/60 text-xs truncate mt-0.5">{m.sub}</p>
              </div>

              <span
                className="text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 whitespace-nowrap"
                style={{ background: m.accent, color: '#07070E' }}
              >
                {m.cta}
              </span>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1 py-1.5" style={{ background: 'rgba(7,7,14,0.7)' }}>
            {mocks.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === index % mocks.length ? 14 : 4, opacity: i === index % mocks.length ? 1 : 0.3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="h-1 rounded-full"
                style={{ background: m.accent }}
              />
            ))}
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  )
}
