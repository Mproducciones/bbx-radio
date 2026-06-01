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

const MOCK_ADS = {
  top: [
    {
      label: 'Supermercado El Ahorro',
      sub: 'Las mejores ofertas de la semana',
      cta: 'Ver ofertas →',
      from: '#0d0828', to: '#1a0f40',
      accent: '#7B2FFF', badge: 'OFERTA',
      icon: '🛒',
    },
    {
      label: 'AutoMundo Rancagua',
      sub: 'Tu próximo auto te está esperando',
      cta: 'Ver catálogo →',
      from: '#061a10', to: '#0a2e1c',
      accent: '#00D9A0', badge: 'NUEVO',
      icon: '🚗',
    },
    {
      label: 'Clínica Bienvenida',
      sub: 'Agenda tu hora hoy · Atención inmediata',
      cta: 'Agendar →',
      from: '#1a0610', to: '#2e0a1c',
      accent: '#FF006E', badge: 'SALUD',
      icon: '🏥',
    },
  ],
  middle: [
    {
      label: 'Constructora Del Valle',
      sub: "Tu casa soñada en O'Higgins",
      cta: 'Cotizar →',
      from: '#1a1200', to: '#2e1f00',
      accent: '#FFB300', badge: 'PROYECTO',
      icon: '🏠',
    },
    {
      label: 'Pizza Italiana · Delivery',
      sub: 'Delivery a todo Rancagua · 30 min',
      cta: 'Pedir ahora →',
      from: '#1a0800', to: '#2e1000',
      accent: '#FF6B35', badge: 'DELIVERY',
      icon: '🍕',
    },
    {
      label: 'Farmacia Cruz Verde',
      sub: 'Medicamentos al mejor precio',
      cta: 'Ver productos →',
      from: '#001a08', to: '#002e12',
      accent: '#00C853', badge: 'SALUD',
      icon: '💊',
    },
  ],
  bottom: [
    {
      label: '¿Quieres anunciarte aquí?',
      sub: 'Llega a miles de oyentes de Rancagua',
      cta: 'Contactar →',
      from: '#1a0e00', to: '#2e1a00',
      accent: '#db8918', badge: 'PAUTA',
      icon: '📻',
    },
    {
      label: "Instituto O'Higgins",
      sub: 'Carreras técnicas · Matrícula abierta',
      cta: 'Informarme →',
      from: '#001018', to: '#001828',
      accent: '#00D4FF', badge: 'EDUCACIÓN',
      icon: '🎓',
    },
    {
      label: 'BancoEstado',
      sub: 'Créditos para tu negocio sin papeleos',
      cta: 'Simular →',
      from: '#00081a', to: '#000f2e',
      accent: '#4A90D9', badge: 'BANCO',
      icon: '🏦',
    },
  ],
} as const

export function RotatingBanner({ interval = 5, position = 'top', refreshInterval = 30 }: RotatingBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
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
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            className="block relative overflow-hidden rounded-xl shadow-lg w-full bg-[#0F0F1A]"
          >
            {imageUrl ? (
              <img src={imageUrl} alt={ad.nombre} className="w-full h-auto object-cover" style={{ maxHeight: '200px', minHeight: '80px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
            ) : (
              <div className="w-full h-24 flex items-center justify-center"><span className="text-white text-sm font-medium">{ad.nombre}</span></div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/70 text-[#8888AA] text-[10px] px-2 py-0.5 rounded-full">Publicidad</div>
          </motion.a>
        </AnimatePresence>
      </div>
    )
  }

  /* ── Mocks premium ── */
  const m = mocks[index % mocks.length]
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${m.from}, ${m.to})`,
            border: `1px solid ${m.accent}30`,
          }}
        >
          {/* Accent line top */}
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${m.accent}, transparent)` }} />

          <div className="flex items-center gap-3 px-4 py-3">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${m.accent}18`, border: `1px solid ${m.accent}30` }}
            >
              {m.icon}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white text-sm font-bold truncate">{m.label}</p>
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ color: m.accent, background: `${m.accent}20` }}
                >
                  {m.badge}
                </span>
              </div>
              <p className="text-[#8888AA] text-xs truncate">{m.sub}</p>
            </div>

            {/* CTA */}
            <span
              className="text-xs font-bold flex-shrink-0 px-3 py-1.5 rounded-lg"
              style={{ color: m.accent, background: `${m.accent}15`, border: `1px solid ${m.accent}30` }}
            >
              {m.cta}
            </span>
          </div>

          {/* Footer label */}
          <div className="absolute bottom-1.5 right-3 text-[#444468] text-[9px]">Publicidad</div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1 pb-2">
            {mocks.map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-all duration-300"
                style={{ background: i === index % mocks.length ? m.accent : `${m.accent}33` }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
