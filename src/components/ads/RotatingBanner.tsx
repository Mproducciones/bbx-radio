'use client'

import { useEffect, useState } from 'react'
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
    { label: 'Supermercado El Ahorro',  sub: 'Las mejores ofertas de la semana · Rancagua', from: '#1a1050', to: '#2d1a70', accent: '#7B2FFF', icon: 'S' },
    { label: 'AutoMundo Rancagua',      sub: 'Los mejores vehiculos al mejor precio',        from: '#0a2a1a', to: '#0d4028', accent: '#00D9A0', icon: 'A' },
    { label: 'Clinica Bienvenida',      sub: 'Tu salud es nuestra prioridad · Agenda hoy',   from: '#2a0a1a', to: '#4a0d28', accent: '#FF006E', icon: '+' },
  ],
  middle: [
    { label: 'Constructora Del Valle',  sub: "Tu casa sonada en el corazon de O'Higgins",   from: '#1a1500', to: '#2e2300', accent: '#FFB300', icon: 'C' },
    { label: 'Pizza Italiana Delivery', sub: 'Delivery a todo Rancagua · Pidenos ahora',     from: '#2a1000', to: '#3d1800', accent: '#FF6B35', icon: 'P' },
    { label: 'Farmacia Cruz Verde',     sub: 'Salud y bienestar para toda tu familia',        from: '#001a0a', to: '#002d14', accent: '#00C853', icon: '+' },
  ],
  bottom: [
    { label: 'Pauta en Radio Bienvenida', sub: 'Llega a miles de oyentes · +56 9 2210 5555', from: '#1a1000', to: '#2e1c00', accent: '#db8918', icon: 'R' },
    { label: "Instituto O'Higgins",       sub: 'Carreras tecnicas y profesionales',            from: '#001020', to: '#001c38', accent: '#00D4FF', icon: 'I' },
    { label: 'Banco Estado',              sub: 'Creditos para tu negocio sin papeleos',         from: '#000a1a', to: '#001030', accent: '#4A90D9', icon: 'B' },
  ],
} as const

export function RotatingBanner({ interval = 5, position = 'top', refreshInterval = 5 }: RotatingBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [index, setIndex] = useState(0)

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
    }
    load()
    const t = setInterval(load, refreshInterval * 1000)
    return () => clearInterval(t)
  }, [position, refreshInterval])

  const total = ads.length > 0 ? ads.length : MOCK_ADS[position].length
  useEffect(() => {
    if (total <= 1) return
    const t = setInterval(() => setIndex((p) => (p + 1) % total), interval * 1000)
    return () => clearInterval(t)
  }, [total, interval])

  const wrap = {
    top:    'w-full max-w-4xl mx-auto mb-4',
    middle: 'w-full max-w-4xl mx-auto my-8',
    bottom: 'w-full max-w-4xl mx-auto mt-4',
  }[position]

  /* ── Anuncios reales de Sanity ── */
  if (ads.length > 0) {
    const ad = ads[index % ads.length]
    const imageUrl = ad.imagenUrl || (ad.imagen ? urlFor(ad.imagen).url() : '')
    return (
      <div className={wrap}>
        <a
          href={ad.enlace || '#'}
          target={ad.enlace ? '_blank' : undefined}
          rel={ad.enlace ? 'noopener noreferrer' : undefined}
          className="block relative overflow-hidden rounded-xl shadow-lg w-full bg-[var(--color-ink-800)]"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={ad.nombre}
              className="w-full h-auto object-cover transition-opacity duration-500"
              style={{ maxHeight: '200px', minHeight: '100px' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-[var(--color-mag-800)] to-[var(--color-pur-800)]">
              <span className="text-white text-sm font-medium">{ad.nombre}</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Anuncio</div>
        </a>
      </div>
    )
  }

  /* ── Mocks de referencia (sin ads en Sanity) ── */
  const m = MOCK_ADS[position][index % MOCK_ADS[position].length]
  return (
    <div className={wrap}>
      <div
        className="w-full rounded-xl flex items-center justify-between px-5"
        style={{
          minHeight: '84px',
          background: `linear-gradient(135deg, ${m.from}, ${m.to})`,
          border: `1px dashed ${m.accent}88`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base flex-shrink-0"
            style={{ background: `${m.accent}33`, color: m.accent }}
          >
            {m.icon}
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{m.label}</p>
            <p className="text-xs mt-0.5" style={{ color: m.accent }}>{m.sub}</p>
          </div>
        </div>
        <span className="text-[#555580] text-xs flex-shrink-0 ml-4">Anuncio</span>
      </div>
    </div>
  )
}
