/** Duración mínima comercial recomendada (≈ 1 mes). */
export const AD_MIN_STANDARD_DAYS = 28

export type AdDurationPresetId =
  | 'mes_estandar'
  | 'mes_calendario'
  | 'quincena'
  | 'semana'
  | 'finde'

export type AdDurationPreset = {
  id: AdDurationPresetId
  label: string
  short: string
  days: number | 'calendar_month'
  nota: string
  /** Si es menor al estándar mensual */
  esCorta: boolean
}

export const AD_DURATION_PRESETS: AdDurationPreset[] = [
  {
    id: 'mes_estandar',
    label: '1 mes (30 días)',
    short: '30 d',
    days: 30,
    nota: 'Tarifa habitual de planes Básico / Premium / Empresarial.',
    esCorta: false,
  },
  {
    id: 'mes_calendario',
    label: 'Mes calendario',
    short: 'Mes',
    days: 'calendar_month',
    nota: 'Del día 1 al último día del mes en curso (o el mes que elijas al crear).',
    esCorta: false,
  },
  {
    id: 'quincena',
    label: '15 días',
    short: '15 d',
    days: 15,
    nota: 'Campaña corta: cobrar proporcional o paquete quincenal acordado.',
    esCorta: true,
  },
  {
    id: 'semana',
    label: '1 semana (7 días)',
    short: '7 d',
    days: 7,
    nota: 'Ideal para eventos, promos flash o auspicios de programa puntual.',
    esCorta: true,
  },
  {
    id: 'finde',
    label: 'Fin de semana (3 días)',
    short: '3 d',
    days: 3,
    nota: 'Solo app o refuerzo FM; confirmar con ventas antes de activar.',
    esCorta: true,
  },
]

export function getDurationPreset(id: AdDurationPresetId): AdDurationPreset {
  return AD_DURATION_PRESETS.find(p => p.id === id) ?? AD_DURATION_PRESETS[0]
}

function endOfCalendarMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

/** Calcula rango sugerido para cargar en Studio (fechas ISO locales CL). */
export function computeCampaignDates(
  presetId: AdDurationPresetId,
  start = new Date(),
): { inicio: string; fin: string; days: number; esCorta: boolean } {
  const preset = getDurationPreset(presetId)
  const inicioDate = new Date(start)
  inicioDate.setHours(0, 0, 0, 0)

  let finDate: Date
  if (preset.days === 'calendar_month') {
    finDate = endOfCalendarMonth(inicioDate)
  } else {
    finDate = new Date(inicioDate)
    finDate.setDate(finDate.getDate() + preset.days)
    finDate.setHours(23, 59, 59, 999)
  }

  const days = Math.ceil((finDate.getTime() - inicioDate.getTime()) / 86_400_000)

  return {
    inicio: inicioDate.toISOString(),
    fin: finDate.toISOString(),
    days,
    esCorta: days < AD_MIN_STANDARD_DAYS,
  }
}

export function campaignDaysBetween(fechaInicio: string, fechaFin: string): number {
  const a = new Date(fechaInicio).getTime()
  const b = new Date(fechaFin).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0
  return Math.max(0, Math.ceil((b - a) / 86_400_000))
}

export function isShortCampaign(fechaInicio: string, fechaFin: string): boolean {
  return campaignDaysBetween(fechaInicio, fechaFin) < AD_MIN_STANDARD_DAYS
}

export function formatDateCL(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}
