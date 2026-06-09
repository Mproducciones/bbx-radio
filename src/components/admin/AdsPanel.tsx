'use client'

import { useState, useEffect } from 'react'
import { studioStructurePath } from '@/lib/studioStructure'
import { isTipoAllowedForPlan, planLabel, AD_TIPO_LABELS } from '@/lib/adPlanRules'
import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { AdminBadge, AdminCard, AdminCardHeader, AdminGhostButton, AdminIcons, AdminSpinner } from './adminUi'

const STUDIO_PUBLICIDAD = studioStructurePath('publicidad')

interface Ad {
  _id: string
  nombre: string
  cliente?: string
  tipo: string
  planContratado?: SponsorPlanId
  activo: boolean
  fechaInicio: string
  fechaFin: string
  prioridad: number
  tagline?: string
  cta?: string
  colorAccent?: string
}

type AdMetric = { adId: string; adTipo: string; impressions: number; clicks: number; ctr: number }

const TIPO_LABEL: Record<string, string> = {
  banner_premium: AD_TIPO_LABELS.banner_premium,
  banner_superior: AD_TIPO_LABELS.banner_superior,
  banner_intermedio: AD_TIPO_LABELS.banner_intermedio,
  banner_inferior: AD_TIPO_LABELS.banner_inferior,
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
  const [metrics, setMetrics] = useState<AdMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7)
    Promise.all([
      fetch('/api/admin/ads', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
      fetch(`/api/admin/reports?scope=ads&month=${month}`, { credentials: 'include' }).then(r => r.ok ? r.json() : { byAd: [] }),
    ]).then(([adsData, adsReport]) => {
      setAds(Array.isArray(adsData) ? adsData : (adsData.ads ?? []))
      setMetrics(adsReport.byAd ?? [])
    }).finally(() => setLoading(false))
  }, [])

  function metricsFor(adId: string) {
    return metrics.find(m => m.adId === adId)
  }

  const active   = ads.filter(a => a.activo && !isExpired(a.fechaFin))
  const expiring = ads.filter(a => a.activo && !isExpired(a.fechaFin) && daysLeft(a.fechaFin) <= 7)
  const inactive = ads.filter(a => !a.activo || isExpired(a.fechaFin))

  return (
    <AdminCard accent="#7D59B5">
      <AdminCardHeader
        title="Campañas"
        icon={<AdminIcons.megaphone />}
        badges={
          <>
            {active.length > 0 && <AdminBadge color="#00D9A0">{active.length} activa{active.length > 1 ? 's' : ''}</AdminBadge>}
            {expiring.length > 0 && <AdminBadge color="#FFB300">{expiring.length} por vencer</AdminBadge>}
          </>
        }
        action={<AdminGhostButton href={STUDIO_PUBLICIDAD}>+ Nueva campaña</AdminGhostButton>}
      />

      <div className="divide-y divide-white/[0.05] max-h-80 overflow-y-auto">
        {loading ? (
          <AdminSpinner />
        ) : ads.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[#444468] text-xs">Sin campañas. Crea una desde Studio.</p>
            <a href={STUDIO_PUBLICIDAD} target="_blank"
              className="mt-3 inline-block text-[#db8918] text-xs border border-[#db8918]/30 rounded-lg px-4 py-2 hover:bg-[#db8918]/10 transition-colors">
              Crear en Studio
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
                      {ad.planContratado && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 bg-white/[0.06] text-white/55">
                          {planLabel(ad.planContratado)}
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${accent}15`, color: accent }}>
                        {TIPO_LABEL[ad.tipo] ?? ad.tipo}
                      </span>
                      {ad.planContratado && !isTipoAllowedForPlan(ad.tipo, ad.planContratado) && (
                        <span className="text-[9px] text-[#FFB300] font-semibold">⚠ tipo no coincide con plan</span>
                      )}
                    </div>
                    <p className="text-[#444468] text-[10px] mt-0.5">
                      Vence {new Date(ad.fechaFin).toLocaleDateString('es-CL')} ·{' '}
                      <span style={{ color: warning ? '#FFB300' : '#666690' }}>
                        {days === 0 ? 'hoy' : `${days} día${days > 1 ? 's' : ''}`}
                      </span>
                      {(() => {
                        const m = metricsFor(ad._id)
                        if (!m) return null
                        return (
                          <span className="text-[#666690]">
                            {' · '}{m.impressions} imp · {m.clicks} clk{m.ctr > 0 ? ` · ${m.ctr}%` : ''}
                          </span>
                        )
                      })()}
                    </p>
                  </div>
                  <a href={STUDIO_PUBLICIDAD} target="_blank"
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
    </AdminCard>
  )
}
