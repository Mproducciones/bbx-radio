'use client'

import { useState, useEffect } from 'react'

interface Ad {
  _id: string
  nombre: string
  cliente?: string
  tipo: string
  activo: boolean
  fechaInicio: string
  fechaFin: string
  prioridad: number
  tagline?: string
  cta?: string
  colorAccent?: string
}

const TIPO_LABEL: Record<string, string> = {
  banner_premium:     '⭐ Premium',
  banner_superior:    '↑ Superior',
  banner_intermedio:  '↔ Intermedio',
  banner_inferior:    '↓ Inferior',
}

function isExpired(fechaFin: string) {
  return new Date(fechaFin) < new Date()
}

function daysLeft(fechaFin: string) {
  const diff = new Date(fechaFin).getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

export function AdsPanel() {
  const [ads, setAds]       = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/ads', { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setAds)
      .finally(() => setLoading(false))
  }, [])

  const active   = ads.filter(a => a.activo && !isExpired(a.fechaFin))
  const expiring = ads.filter(a => a.activo && !isExpired(a.fechaFin) && daysLeft(a.fechaFin) <= 7)
  const inactive = ads.filter(a => !a.activo || isExpired(a.fechaFin))

  return (
    <div className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-[#1A1A2E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📢</span>
          <p className="text-white font-semibold text-sm">Campañas</p>
          {active.length > 0 && (
            <span className="bg-[#00D9A0] text-[#07070E] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {active.length} activa{active.length > 1 ? 's' : ''}
            </span>
          )}
          {expiring.length > 0 && (
            <span className="bg-[#FFB300] text-[#07070E] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {expiring.length} por vencer
            </span>
          )}
        </div>
        <a href="/studio" target="_blank"
          className="text-[#444468] hover:text-white transition-colors text-xs border border-[#1A1A2E] rounded-lg px-2.5 py-1">
          + Nueva campaña
        </a>
      </div>

      <div className="divide-y divide-[#1A1A2E] max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-6 flex justify-center">
            <div className="w-5 h-5 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ads.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[#444468] text-xs">Sin campañas. Crea una desde Studio.</p>
            <a href="/studio" target="_blank"
              className="mt-3 inline-block text-[#db8918] text-xs border border-[#db8918]/30 rounded-lg px-4 py-2 hover:bg-[#db8918]/10 transition-colors">
              Abrir Studio
            </a>
          </div>
        ) : (
          <>
            {active.map(ad => {
              const days = daysLeft(ad.fechaFin)
              const accent = ad.colorAccent ?? '#db8918'
              const warning = days <= 7
              return (
                <div key={ad._id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: warning ? '#FFB300' : '#00D9A0' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-white text-xs font-semibold truncate">{ad.cliente ?? ad.nombre}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${accent}15`, color: accent }}>
                        {TIPO_LABEL[ad.tipo] ?? ad.tipo}
                      </span>
                    </div>
                    <p className="text-[#444468] text-[10px] mt-0.5">
                      Vence {new Date(ad.fechaFin).toLocaleDateString('es-CL')} ·{' '}
                      <span style={{ color: warning ? '#FFB300' : '#666690' }}>
                        {days === 0 ? 'hoy' : `${days} día${days > 1 ? 's' : ''}`}
                      </span>
                    </p>
                  </div>
                  <a href="/studio" target="_blank"
                    className="text-[#333355] hover:text-white transition-colors text-[10px] flex-shrink-0">
                    editar →
                  </a>
                </div>
              )
            })}
            {inactive.length > 0 && (
              <div className="px-4 py-2">
                <p className="text-[#333355] text-[10px] uppercase tracking-wider">Inactivas / vencidas ({inactive.length})</p>
              </div>
            )}
            {inactive.map(ad => (
              <div key={ad._id} className="px-4 py-2.5 flex items-center gap-3 opacity-40">
                <div className="w-2 h-2 rounded-full bg-[#333355] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs truncate">{ad.cliente ?? ad.nombre}</p>
                  <p className="text-[#333355] text-[10px]">{TIPO_LABEL[ad.tipo] ?? ad.tipo} · {isExpired(ad.fechaFin) ? 'Vencida' : 'Pausada'}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
