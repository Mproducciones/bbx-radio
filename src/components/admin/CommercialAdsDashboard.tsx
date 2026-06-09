'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AD_MIN_STANDARD_DAYS, formatDateCL, isShortCampaign } from '@/lib/adCampaignDuration'
import {
  AD_PLAN_RULES,
  AD_TIPO_LABELS,
  getAdPlanRule,
  isTipoAllowedForPlan,
  type AdBannerTipo,
} from '@/lib/adPlanRules'
import {
  campaignStatus,
  daysLeft,
  filterClientGroups,
  groupAdsByClient,
  type AdminAdRow,
  type ClientAdGroup,
} from '@/lib/groupAdsByClient'
import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { AdminCampaignForm } from '@/components/admin/AdminCampaignForm'
import {
  AdminBadge,
  AdminCard,
  AdminCardHeader,
  AdminGhostButton,
  AdminIcons,
  AdminKpi,
  AdminKpiGrid,
  AdminSegment,
  AdminSpinner,
} from './adminUi'

type FormState =
  | { mode: 'create'; plan: SponsorPlanId }
  | { mode: 'edit'; ad: AdminAdRow }

const PLAN_COLORS: Record<SponsorPlanId, string> = {
  basico: '#40B9BF',
  premium: '#db8918',
  empresarial: '#7D59B5',
}

const TIPO_SHORT: Record<AdBannerTipo, string> = {
  banner_premium: 'Premium',
  banner_superior: 'Arriba',
  banner_intermedio: 'Medio',
  banner_inferior: 'Abajo',
}

type FilterKey = 'todos' | 'activos' | 'vencer' | 'vencidos' | 'alertas'

type AdMetric = { adId: string; impressions: number; clicks: number; ctr: number }

function PlanActionButton({
  plan,
  active,
  onClick,
}: {
  plan: SponsorPlanId
  active: boolean
  onClick: () => void
}) {
  const rule = getAdPlanRule(plan)
  const color = PLAN_COLORS[plan]
  return (
    <button
      type="button"
      onClick={onClick}
      className="admin-plan-tile"
      style={{
        background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
        border: active ? `2px solid ${color}88` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? `0 10px 28px ${color}30` : undefined,
      }}
    >
      <p className="text-sm font-black uppercase tracking-wide" style={{ color }}>
        {rule.nombre}
      </p>
      <p className="admin-hint mt-1">{rule.precioReferencia}</p>
    </button>
  )
}

function ClientCard({
  group,
  metrics,
  onEdit,
  onToggleActivo,
}: {
  group: ClientAdGroup
  metrics: Map<string, AdMetric>
  onEdit: (ad: AdminAdRow) => void
  onToggleActivo: (id: string, activo: boolean) => void
}) {
  const color = group.dominantPlan ? PLAN_COLORS[group.dominantPlan] : '#db8918'

  return (
    <div className="admin-client-card">
      <div
        className="px-4 py-3.5 flex items-center gap-3 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: `${color}0a` }}
      >
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
          style={{ background: `${color}22`, color }}
        >
          {group.clientName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-white text-base font-bold truncate">{group.clientName}</p>
          <p className="admin-hint mt-0.5">
            {group.activeCount} activa{group.activeCount !== 1 ? 's' : ''}
            {group.expiringCount > 0 && ` · ${group.expiringCount} por vencer`}
          </p>
        </div>
        {group.dominantPlan && (
          <AdminBadge color={color}>{getAdPlanRule(group.dominantPlan).nombre}</AdminBadge>
        )}
        {group.hasIssue && <AdminBadge color="#FFB300">Revisar</AdminBadge>}
      </div>

      <div className="p-3 flex flex-col gap-2">
        {group.campaigns.map(ad => {
          const st = campaignStatus(ad)
          const accent = ad.colorAccent ?? '#db8918'
          const dl = daysLeft(ad.fechaFin)
          const m = metrics.get(ad._id)
          const corta = isShortCampaign(ad.fechaInicio, ad.fechaFin)
          const tipoKey = ad.tipo as AdBannerTipo
          const planMismatch = ad.planContratado && !isTipoAllowedForPlan(ad.tipo, ad.planContratado)

          return (
            <div
              key={ad._id}
              className="flex flex-col sm:flex-row sm:items-center gap-2.5 rounded-xl px-3 py-3"
              style={{
                background: st === 'inactive' ? 'transparent' : 'rgba(255,255,255,0.03)',
                opacity: st === 'inactive' ? 0.45 : 1,
              }}
            >
              <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                <button
                  type="button"
                  disabled
                  className="admin-chip shrink-0 cursor-default !min-h-0"
                  style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
                  title={AD_TIPO_LABELS[tipoKey] ?? ad.tipo}
                >
                  {TIPO_SHORT[tipoKey] ?? ad.tipo}
                </button>
                {ad.planContratado && (
                  <span className="text-xs text-white/50 font-semibold">{getAdPlanRule(ad.planContratado).nombre}</span>
                )}
                <span className="text-xs text-white/45 truncate">
                  {formatDateCL(ad.fechaInicio)} – {formatDateCL(ad.fechaFin)}
                  {st !== 'inactive' && ` · ${dl === 0 ? 'hoy' : `${dl}d`}`}
                </span>
                {corta && st !== 'inactive' && (
                  <span className="text-xs font-bold text-[#FFB300]">Corta</span>
                )}
                {planMismatch && <span className="text-xs font-bold text-[#FF3860]">Plan≠tipo</span>}
                {ad.exclusivoApp && st !== 'inactive' && (
                  <span className="text-xs font-bold text-[#7D59B5]">Exclusivo</span>
                )}
                {m && (
                  <span className="text-xs text-white/40">
                    {m.impressions} imp · {m.clicks} clk
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => onEdit(ad)}
                  className="admin-btn-ghost !min-h-0 !py-2"
                >
                  Editar
                </button>
                {st !== 'inactive' || ad.activo ? (
                  <button
                    type="button"
                    onClick={() => onToggleActivo(ad._id, !ad.activo)}
                    className="admin-btn-ghost !min-h-0 !py-2"
                  >
                    {ad.activo ? 'Pausar' : 'Activar'}
                  </button>
                ) : null}
                <span
                  className="admin-chip uppercase !min-h-0"
                  style={{
                    background:
                      st === 'active' ? 'rgba(0,217,160,0.12)' : st === 'expiring' ? 'rgba(255,179,0,0.12)' : 'rgba(255,255,255,0.04)',
                    color: st === 'active' ? '#00D9A0' : st === 'expiring' ? '#FFB300' : '#666',
                  }}
                >
                  {st === 'inactive' ? (new Date(ad.fechaFin) < new Date() ? 'Vencida' : 'Pausa') : st === 'expiring' ? 'Vence' : 'Al aire'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CommercialAdsDashboard() {
  const [ads, setAds] = useState<AdminAdRow[]>([])
  const [metrics, setMetrics] = useState<AdMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>('activos')
  const [newPlan, setNewPlan] = useState<SponsorPlanId | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [writeEnabled, setWriteEnabled] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    const month = new Date().toISOString().slice(0, 7)
    Promise.all([
      fetch('/api/admin/ads', { credentials: 'include' }).then(r => (r.ok ? r.json() : { ads: [] })),
      fetch(`/api/admin/reports?scope=ads&month=${month}`, { credentials: 'include' }).then(r =>
        r.ok ? r.json() : { byAd: [] },
      ),
    ])
      .then(([adsData, report]) => {
        setAds(Array.isArray(adsData) ? adsData : (adsData.ads ?? []))
        setWriteEnabled(Boolean(adsData.writeEnabled))
        setMetrics(report.byAd ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  async function toggleActivo(id: string, activo: boolean) {
    const res = await fetch('/api/admin/ads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ _id: id, activo }),
    })
    if (res.ok) load()
  }

  function openCreate(plan: SponsorPlanId) {
    setForm({ mode: 'create', plan })
    setNewPlan(plan)
  }

  function closeForm() {
    setForm(null)
    setNewPlan(null)
  }

  useEffect(() => {
    load()
  }, [load])

  const metricsMap = useMemo(() => new Map(metrics.map(m => [m.adId, m])), [metrics])

  const allGroups = useMemo(() => groupAdsByClient(ads), [ads])
  const groups = useMemo(() => filterClientGroups(allGroups, filter), [allGroups, filter])

  const stats = useMemo(() => {
    const active = ads.filter(a => campaignStatus(a) !== 'inactive')
    const expiring = ads.filter(a => campaignStatus(a) === 'expiring')
    const alertas = ads.filter(
      a =>
        campaignStatus(a) !== 'inactive' &&
        (isShortCampaign(a.fechaInicio, a.fechaFin) ||
          (a.planContratado && !isTipoAllowedForPlan(a.tipo, a.planContratado))),
    )
    return {
      clientes: allGroups.filter(g => g.activeCount > 0).length,
      activas: active.length,
      porVencer: expiring.length,
      alertas: alertas.length,
    }
  }, [ads, allGroups])

  return (
    <AdminCard accent="#db8918" className="overflow-hidden">
      <AdminCardHeader
        title="Publicidad · orden por cliente"
        icon={<AdminIcons.megaphone />}
        badges={
          <>
            <AdminBadge color="#00D9A0">{stats.clientes} clientes al aire</AdminBadge>
            {stats.alertas > 0 && <AdminBadge color="#FFB300">{stats.alertas} alerta{stats.alertas > 1 ? 's' : ''}</AdminBadge>}
          </>
        }
        action={
          <div className="flex gap-2 flex-wrap">
            <AdminGhostButton onClick={load}>Actualizar</AdminGhostButton>
            <AdminGhostButton onClick={() => openCreate('basico')}>+ Nueva campaña</AdminGhostButton>
          </div>
        }
      />

      <div className="admin-card-body space-y-5">
        <AdminKpiGrid>
          <AdminKpi value={stats.clientes} sub="Clientes activos" color="#40B9BF" icon={<AdminIcons.megaphone />} />
          <AdminKpi value={stats.activas} sub="Campañas al aire" color="#00D9A0" icon={<AdminIcons.chart />} />
          <AdminKpi value={stats.porVencer} sub="Por vencer (7 d)" color="#FFB300" icon={<AdminIcons.bell />} />
          <AdminKpi value={stats.alertas} sub="Revisar" color="#FF3860" icon={<AdminIcons.wave />} />
        </AdminKpiGrid>

        <AdminSegment
          accent="#db8918"
          value={filter}
          onChange={v => setFilter(v as FilterKey)}
          options={[
            { value: 'activos', label: 'Al aire' },
            { value: 'vencer', label: 'Por vencer' },
            { value: 'alertas', label: 'Alertas' },
            { value: 'vencidos', label: 'Vencidos' },
            { value: 'todos', label: 'Todos' },
          ]}
        />

        {!writeEnabled && (
          <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2.5">
            Para guardar campañas desde aquí, agrega <strong>SANITY_API_TOKEN</strong> en Vercel y redeploy.
          </p>
        )}

        {form ? (
          <AdminCampaignForm
            mode={form.mode}
            plan={form.mode === 'create' ? form.plan : (form.ad.planContratado ?? 'basico')}
            initial={form.mode === 'edit' ? form.ad : undefined}
            writeEnabled={writeEnabled}
            onSuccess={() => { closeForm(); load() }}
            onCancel={closeForm}
          />
        ) : (
          <div>
            <p className="admin-label mb-3">Nueva campaña (elige plan)</p>
            <div className="flex flex-wrap gap-2">
              {AD_PLAN_RULES.map(r => (
                <PlanActionButton
                  key={r.id}
                  plan={r.id}
                  active={newPlan === r.id}
                  onClick={() => openCreate(r.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="admin-label mb-3">
            Clientes y campañas ({groups.length})
          </p>
          {loading ? (
            <AdminSpinner />
          ) : groups.length === 0 ? (
            <div className="rounded-2xl py-12 text-center border border-dashed border-white/12">
              <p className="admin-body">No hay clientes en este filtro.</p>
              <button
                type="button"
                onClick={() => openCreate('basico')}
                className="mt-4 text-sm font-bold text-[#db8918] underline"
              >
                Crear primera campaña
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[min(32rem,55vh)] overflow-y-auto pr-0.5">
              {groups.map(g => (
                <ClientCard
                  key={g.clientKey}
                  group={g}
                  metrics={metricsMap}
                  onEdit={ad => setForm({ mode: 'edit', ad })}
                  onToggleActivo={toggleActivo}
                />
              ))}
            </div>
          )}
        </div>

        <details className="rounded-xl border border-white/[0.08] px-4 py-3 admin-hint">
          <summary className="cursor-pointer font-bold text-white/65 py-1 text-sm">Regla de duración</summary>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Estándar de venta: <strong className="text-white/60">mínimo ~{AD_MIN_STANDARD_DAYS} días</strong> (1 mes).</li>
            <li>Campañas de 3, 7 o 15 días: usar botones de duración corta y confirmar precio con ventas.</li>
            <li>Las fechas inicio/fin controlan cuándo se ve en la app (no el plan solo).</li>
          </ul>
        </details>
      </div>
    </AdminCard>
  )
}
