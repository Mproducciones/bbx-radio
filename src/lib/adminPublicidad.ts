import type { AdDurationPresetId } from '@/lib/adCampaignDuration'
import {
  AD_TIPO_LABELS,
  getAdPlanRule,
  isTipoAllowedForPlan,
  type AdBannerTipo,
} from '@/lib/adPlanRules'
import { sanitizeAdLink } from '@/lib/safeUrl'
import type { SponsorPlanId } from '@/lib/sponsorPlans'

export type PublicidadPayload = {
  nombre: string
  cliente: string
  planContratado: SponsorPlanId
  tipo: AdBannerTipo
  duracionCampana: AdDurationPresetId
  fechaInicio: string
  fechaFin: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
  enlace?: string
  exclusivoApp?: boolean
  activo?: boolean
  prioridad?: number
}

export type PublicidadDoc = PublicidadPayload & { _id: string }

const PLANS: SponsorPlanId[] = ['basico', 'premium', 'empresarial']
const TIPOS = Object.keys(AD_TIPO_LABELS) as AdBannerTipo[]
const DURATIONS: AdDurationPresetId[] = ['mes_estandar', 'mes_calendario', 'quincena', 'semana', 'finde']

function isPlan(v: unknown): v is SponsorPlanId {
  return typeof v === 'string' && PLANS.includes(v as SponsorPlanId)
}

function isTipo(v: unknown): v is AdBannerTipo {
  return typeof v === 'string' && TIPOS.includes(v as AdBannerTipo)
}

function isDuration(v: unknown): v is AdDurationPresetId {
  return typeof v === 'string' && DURATIONS.includes(v as AdDurationPresetId)
}

function trimStr(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function parseIsoDate(v: unknown): string | null {
  if (typeof v !== 'string' || !v.trim()) return null
  const d = new Date(v)
  return Number.isFinite(d.getTime()) ? d.toISOString() : null
}

export function defaultPrioridad(plan: SponsorPlanId): number {
  const rule = getAdPlanRule(plan)
  const { min, max, premiumMin } = rule.prioridadSugerida
  if (premiumMin && plan !== 'basico') return premiumMin
  return Math.round((min + max) / 2)
}

export function parsePublicidadPayload(body: unknown): { ok: true; data: PublicidadPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Datos inválidos' }
  }

  const b = body as Record<string, unknown>
  const nombre = trimStr(b.nombre, 120)
  const cliente = trimStr(b.cliente, 120)
  if (!nombre) return { ok: false, error: 'Nombre de campaña requerido' }
  if (!cliente) return { ok: false, error: 'Cliente / empresa requerido' }
  if (!isPlan(b.planContratado)) return { ok: false, error: 'Plan inválido' }
  if (!isTipo(b.tipo)) return { ok: false, error: 'Tipo de banner inválido' }
  if (!isTipoAllowedForPlan(b.tipo, b.planContratado)) {
    return { ok: false, error: 'Ese tipo de banner no corresponde al plan elegido' }
  }
  if (!isDuration(b.duracionCampana)) return { ok: false, error: 'Duración inválida' }

  const fechaInicio = parseIsoDate(b.fechaInicio)
  const fechaFin = parseIsoDate(b.fechaFin)
  if (!fechaInicio || !fechaFin) return { ok: false, error: 'Fechas de inicio y fin requeridas' }
  if (new Date(fechaFin) <= new Date(fechaInicio)) {
    return { ok: false, error: 'La fecha de fin debe ser posterior al inicio' }
  }

  const enlaceRaw = trimStr(b.enlace, 500)
  const enlace = enlaceRaw ? sanitizeAdLink(enlaceRaw) : undefined
  if (enlaceRaw && !enlace) return { ok: false, error: 'Enlace inválido (usa https:// o wa.me/…)' }

  const imagenUrlRaw = trimStr(b.imagenUrl, 500)
  let imagenUrl: string | undefined
  if (imagenUrlRaw) {
    const img = sanitizeAdLink(imagenUrlRaw)
    if (!img) return { ok: false, error: 'URL de imagen inválida' }
    imagenUrl = img
  }

  const colorRaw = trimStr(b.colorAccent, 16)
  const colorAccent = colorRaw && /^#[0-9A-Fa-f]{3,8}$/.test(colorRaw) ? colorRaw : '#db8918'

  let prioridad = typeof b.prioridad === 'number' ? Math.round(b.prioridad) : defaultPrioridad(b.planContratado)
  prioridad = Math.max(1, Math.min(99, prioridad))

  const exclusivoApp = Boolean(b.exclusivoApp)
  if (exclusivoApp && b.planContratado !== 'empresarial') {
    return { ok: false, error: 'Exclusivo en app solo aplica al plan Empresarial' }
  }

  return {
    ok: true,
    data: {
      nombre,
      cliente,
      planContratado: b.planContratado,
      tipo: b.tipo,
      duracionCampana: b.duracionCampana,
      fechaInicio,
      fechaFin,
      tagline: trimStr(b.tagline, 160) || undefined,
      cta: trimStr(b.cta, 60) || undefined,
      colorAccent,
      imagenUrl,
      enlace,
      exclusivoApp,
      activo: b.activo !== false,
      prioridad,
    },
  }
}

export function toSanityFields(data: PublicidadPayload): Record<string, unknown> {
  return {
    nombre: data.nombre,
    cliente: data.cliente,
    planContratado: data.planContratado,
    tipo: data.tipo,
    duracionCampana: data.duracionCampana,
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,
    tagline: data.tagline ?? null,
    cta: data.cta ?? null,
    colorAccent: data.colorAccent ?? '#db8918',
    imagenUrl: data.imagenUrl ?? null,
    enlace: data.enlace ?? null,
    exclusivoApp: data.exclusivoApp ?? false,
    activo: data.activo !== false,
    prioridad: data.prioridad ?? defaultPrioridad(data.planContratado),
  }
}

/** PATCH completo o solo `{ _id, activo }` para pausar/reanudar. */
export function parsePublicidadPatch(body: unknown): { ok: true; id: string; patch: Record<string, unknown> } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Datos inválidos' }
  const b = body as Record<string, unknown>
  const id = trimStr(b._id, 64)
  if (!id) return { ok: false, error: 'ID requerido' }

  const fieldKeys = Object.keys(b).filter(k => k !== '_id')
  if (fieldKeys.length === 1 && fieldKeys[0] === 'activo') {
    return { ok: true, id, patch: { activo: Boolean(b.activo) } }
  }

  const full = parsePublicidadPayload(b)
  if (!full.ok) return full
  return { ok: true, id, patch: toSanityFields(full.data) }
}
