'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AD_DURATION_PRESETS,
  computeCampaignDates,
  type AdDurationPresetId,
} from '@/lib/adCampaignDuration'
import {
  AD_TIPO_LABELS,
  getAdPlanRule,
  isTipoAllowedForPlan,
  type AdBannerTipo,
} from '@/lib/adPlanRules'
import { defaultPrioridad } from '@/lib/adminPublicidad'
import type { AdminAdRow } from '@/lib/groupAdsByClient'
import type { SponsorPlanId } from '@/lib/sponsorPlans'

const PLAN_COLORS: Record<SponsorPlanId, string> = {
  basico: '#40B9BF',
  premium: '#db8918',
  empresarial: '#7D59B5',
}

function toDatetimeLocal(iso: string): string {
  try {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
}

function fromDatetimeLocal(v: string): string {
  return new Date(v).toISOString()
}

type Props = {
  mode: 'create' | 'edit'
  plan: SponsorPlanId
  initial?: AdminAdRow
  writeEnabled: boolean
  onSuccess: () => void
  onCancel: () => void
}

export function AdminCampaignForm({
  mode,
  plan: initialPlan,
  initial,
  writeEnabled,
  onSuccess,
  onCancel,
}: Props) {
  const [plan, setPlan] = useState<SponsorPlanId>(initial?.planContratado ?? initialPlan)
  const [duration, setDuration] = useState<AdDurationPresetId>(
    (initial?.duracionCampana as AdDurationPresetId) ?? 'mes_estandar',
  )
  const [cliente, setCliente] = useState(initial?.cliente ?? '')
  const [nombre, setNombre] = useState(initial?.nombre ?? '')
  const [tipo, setTipo] = useState<AdBannerTipo>(
    (initial?.tipo as AdBannerTipo) ?? getAdPlanRule(initialPlan).tiposRecomendados[0],
  )
  const [tagline, setTagline] = useState(initial?.tagline ?? '')
  const [cta, setCta] = useState(initial?.cta ?? '')
  const [enlace, setEnlace] = useState(initial?.enlace ?? '')
  const [imagenUrl, setImagenUrl] = useState(initial?.imagenUrl ?? '')
  const [colorAccent, setColorAccent] = useState(initial?.colorAccent ?? '#db8918')
  const [prioridad, setPrioridad] = useState(initial?.prioridad ?? defaultPrioridad(plan))
  const [exclusivoApp, setExclusivoApp] = useState(initial?.exclusivoApp ?? false)
  const [activo, setActivo] = useState(initial?.activo ?? true)
  const [fechaInicio, setFechaInicio] = useState(
    initial?.fechaInicio ? toDatetimeLocal(initial.fechaInicio) : toDatetimeLocal(computeCampaignDates('mes_estandar').inicio),
  )
  const [fechaFin, setFechaFin] = useState(
    initial?.fechaFin ? toDatetimeLocal(initial.fechaFin) : toDatetimeLocal(computeCampaignDates('mes_estandar').fin),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rule = getAdPlanRule(plan)
  const color = PLAN_COLORS[plan]
  const allowedTipos = useMemo(() => rule.allowedTipos, [rule])

  useEffect(() => {
    if (mode === 'create' && !initial) {
      const dates = computeCampaignDates(duration)
      setFechaInicio(toDatetimeLocal(dates.inicio))
      setFechaFin(toDatetimeLocal(dates.fin))
    }
  }, [duration, mode, initial])

  useEffect(() => {
    if (!isTipoAllowedForPlan(tipo, plan)) {
      setTipo(rule.tiposRecomendados[0])
    }
  }, [plan, tipo, rule.tiposRecomendados])

  useEffect(() => {
    if (mode === 'create' && !initial) {
      setPrioridad(defaultPrioridad(plan))
    }
  }, [plan, mode, initial])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!writeEnabled) {
      setError('Falta SANITY_API_TOKEN en Vercel. Pedí al administrador que lo configure.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      nombre,
      cliente,
      planContratado: plan,
      tipo,
      duracionCampana: duration,
      fechaInicio: fromDatetimeLocal(fechaInicio),
      fechaFin: fromDatetimeLocal(fechaFin),
      tagline: tagline || undefined,
      cta: cta || undefined,
      enlace: enlace || undefined,
      imagenUrl: imagenUrl || undefined,
      colorAccent,
      prioridad,
      exclusivoApp: plan === 'empresarial' ? exclusivoApp : false,
      activo,
      ...(mode === 'edit' && initial ? { _id: initial._id } : {}),
    }

    try {
      const res = await fetch('/api/admin/ads', {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'No se pudo guardar')
        return
      }
      onSuccess()
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E] outline-none focus:border-[#db8918]/50'

  return (
    <form onSubmit={submit} className="admin-campaign-form rounded-2xl border border-white/10 p-4 space-y-3.5" style={{ background: `${color}08` }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-bold text-white">
          {mode === 'create' ? 'Nueva campaña' : 'Editar campaña'}
        </p>
        <button type="button" onClick={onCancel} className="admin-btn-ghost !min-h-0 !py-1.5 text-xs">
          Cancelar
        </button>
      </div>

      {!writeEnabled && (
        <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2">
          Guardado deshabilitado: falta <code className="text-amber-200">SANITY_API_TOKEN</code> en Vercel.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="admin-label">Cliente / empresa *</span>
          <input value={cliente} onChange={e => setCliente(e.target.value)} required maxLength={120} className={inputClass} placeholder="Ej: Automotora del Sur" />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="admin-label">Nombre de campaña *</span>
          <input value={nombre} onChange={e => setNombre(e.target.value)} required maxLength={120} className={inputClass} placeholder="Ej: Promo verano 2026" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Plan *</span>
          <select value={plan} onChange={e => setPlan(e.target.value as SponsorPlanId)} className={inputClass}>
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
            <option value="empresarial">Empresarial</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Duración</span>
          <select value={duration} onChange={e => setDuration(e.target.value as AdDurationPresetId)} className={inputClass}>
            {AD_DURATION_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="admin-label">Tipo de banner *</span>
          <select value={tipo} onChange={e => setTipo(e.target.value as AdBannerTipo)} className={inputClass}>
            {allowedTipos.map(t => (
              <option key={t} value={t}>{AD_TIPO_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Inicio *</span>
          <input type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Fin *</span>
          <input type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="admin-label">URL imagen del banner</span>
          <input value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} type="url" className={inputClass} placeholder="https://… (800×120 aprox.)" />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="admin-label">Tagline</span>
          <input value={tagline} onChange={e => setTagline(e.target.value)} maxLength={160} className={inputClass} placeholder="Frase del anuncio" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Texto botón (CTA)</span>
          <input value={cta} onChange={e => setCta(e.target.value)} maxLength={60} className={inputClass} placeholder="Ver oferta" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Enlace (web / WhatsApp)</span>
          <input value={enlace} onChange={e => setEnlace(e.target.value)} className={inputClass} placeholder="https:// o https://wa.me/…" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Color (#hex)</span>
          <input value={colorAccent} onChange={e => setColorAccent(e.target.value)} className={inputClass} placeholder="#db8918" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="admin-label">Prioridad ({rule.prioridadSugerida.min}–{rule.prioridadSugerida.max})</span>
          <input type="number" min={1} max={99} value={prioridad} onChange={e => setPrioridad(Number(e.target.value))} className={inputClass} />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-white/60">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
          Activa (visible en la app)
        </label>
        {plan === 'empresarial' && (
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={exclusivoApp} onChange={e => setExclusivoApp(e.target.checked)} />
            Exclusivo en app
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving || !writeEnabled}
        className="admin-btn-accent w-full disabled:opacity-50"
        style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 75%, #fff))` }}
      >
        {saving ? 'Guardando en Sanity…' : mode === 'create' ? 'Crear campaña' : 'Guardar cambios'}
      </button>
      <p className="admin-hint text-center">
        Se guarda en Sanity y aparece en la app al publicar (sin abrir Studio).
      </p>
    </form>
  )
}
