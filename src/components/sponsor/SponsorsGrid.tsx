'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Sponsor = {
  id: string
  name: string
  cliente: string
  tagline?: string
  imagenUrl?: string
  enlace?: string
  colorAccent?: string
  tipos: string[]
}

export function SponsorsGrid({ compact }: { compact?: boolean }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    fetch('/api/sponsors')
      .then(r => r.json())
      .then(setSponsors)
      .catch(() => setSponsors([]))
  }, [])

  if (sponsors.length === 0) {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/50 text-sm">Pronto verás aquí a nuestros patrocinadores activos.</p>
        <Link href="/anunciate" className="inline-block mt-3 text-sm font-bold text-[#db8918]">Anunciate con nosotros →</Link>
      </div>
    )
  }

  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
      {sponsors.map(s => {
        const accent = s.colorAccent ?? '#db8918'
        const inner = (
          <article
            className="rounded-2xl overflow-hidden h-full transition-transform active:scale-[0.98]"
            style={{ background: '#0e0e16', border: `1px solid ${accent}30` }}
          >
            {s.imagenUrl && (
              <div className="h-24 relative">
                <img src={s.imagenUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent, #0e0e16)` }} />
              </div>
            )}
            <div className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>Patrocinador</p>
              <h3 className="text-white font-semibold text-sm">{s.cliente}</h3>
              {s.tagline && <p className="text-white/45 text-xs mt-1 leading-snug">{s.tagline}</p>}
              <p className="text-white/25 text-[10px] mt-2">{s.tipos.length} espacio{s.tipos.length > 1 ? 's' : ''} activo{s.tipos.length > 1 ? 's' : ''}</p>
            </div>
          </article>
        )
        return s.enlace ? (
          <a key={s.id} href={s.enlace} target="_blank" rel="noopener noreferrer">{inner}</a>
        ) : (
          <div key={s.id}>{inner}</div>
        )
      })}
    </div>
  )
}
