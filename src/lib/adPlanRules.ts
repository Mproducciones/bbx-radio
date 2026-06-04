import type { SponsorPlanId } from '@/lib/sponsorPlans'

/** Tipos de banner en Sanity (`publicidad.tipo`). */
export type AdBannerTipo =
  | 'banner_premium'
  | 'banner_superior'
  | 'banner_intermedio'
  | 'banner_inferior'

export const AD_TIPO_LABELS: Record<AdBannerTipo, string> = {
  banner_premium: 'Banner premium (flotante)',
  banner_superior: 'Banner superior',
  banner_intermedio: 'Banner intermedio',
  banner_inferior: 'Banner inferior',
}

/** Dónde se renderiza cada tipo en la app. */
export const AD_PLACEMENTS: Record<
  AdBannerTipo,
  { pantallas: string[]; componente: string; nota: string }
> = {
  banner_premium: {
    pantallas: ['Participa', 'Saludos', 'Programación', 'Desktop (sidebar)'],
    componente: 'PremiumAdBanner (flotante, no tapa En Vivo)',
    nota: 'Solo el de mayor prioridad activo. El oyente puede cerrarlo 30 min.',
  },
  banner_superior: {
    pantallas: ['Noticias (arriba)', 'Programación / Grilla (arriba)'],
    componente: 'RotatingBanner position=top',
    nota: 'Rota cada ~6–8 s si hay varios del mismo tipo.',
  },
  banner_intermedio: {
    pantallas: ['Participa', 'Noticias (medio)'],
    componente: 'RotatingBanner position=middle',
    nota: 'Zona central del feed; ideal para plan Básico.',
  },
  banner_inferior: {
    pantallas: ['Saludos', 'Programación (abajo)'],
    componente: 'RotatingBanner position=bottom',
    nota: 'Antes del menú inferior; buen complemento Básico.',
  },
}

export type AdPlanRule = {
  id: SponsorPlanId
  nombre: string
  precioReferencia: string
  spotsFm: string
  allowedTipos: AdBannerTipo[]
  tiposRecomendados: AdBannerTipo[]
  prioridadSugerida: { min: number; max: number; premiumMin?: number }
  gestionApp: string[]
  gestionFm: string[]
  alertas: string[]
}

/** Reglas operativas: qué cargar en Studio según plan vendido. */
export const AD_PLAN_RULES: AdPlanRule[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    precioReferencia: '$80.000/mes',
    spotsFm: '4 spots de 30 s / día (horarios rotativos — lo coordina cabina)',
    allowedTipos: ['banner_superior', 'banner_intermedio', 'banner_inferior'],
    tiposRecomendados: ['banner_intermedio', 'banner_inferior'],
    prioridadSugerida: { min: 1, max: 5 },
    gestionApp: [
      'Crear 1 campaña en Studio → Publicidad con tipo intermedio o inferior.',
      'Subir imagen (800×120 px aprox.) o URL + tagline + enlace WhatsApp/web.',
      'Fechas inicio/fin = mes contratado. Prioridad 3–5 si comparte espacio.',
      'NO usar banner_premium (reservado Premium/Empresarial).',
    ],
    gestionFm: [
      'Programar 4 pases en la parrilla (no se administra desde la app).',
      'Guardar guión del cliente en carpeta comercial / Drive.',
    ],
    alertas: [
      'Varios clientes Básico rotan en el mismo slot: sube prioridad si renovó.',
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precioReferencia: '$150.000/mes',
    spotsFm: '8 spots en horario peak (mañana, almuerzo, tarde)',
    allowedTipos: ['banner_superior', 'banner_intermedio', 'banner_inferior', 'banner_premium'],
    tiposRecomendados: ['banner_premium', 'banner_intermedio'],
    prioridadSugerida: { min: 6, max: 9, premiumMin: 8 },
    gestionApp: [
      'Crear campaña banner_premium con prioridad ≥ 8 (gana rotación flotante).',
      'Opcional: segunda campaña intermedio/superior con misma marca.',
      'colorAccent = color del cliente (borde y badge “Patrocinador”).',
    ],
    gestionFm: [
      'Cuadrar 8 pases en franjas 07–10, 13–15, 18–21 con producción.',
    ],
    alertas: [
      'Si hay 2 premium activos, gana el de mayor prioridad.',
      'Banner flotante no aparece en En Vivo (no tapa el play).',
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    precioReferencia: '$250.000/mes',
    spotsFm: '12 spots / día + patrocinio de bloque (“Presenta: …”)',
    allowedTipos: ['banner_superior', 'banner_intermedio', 'banner_inferior', 'banner_premium'],
    tiposRecomendados: ['banner_premium'],
    prioridadSugerida: { min: 10, max: 99, premiumMin: 10 },
    gestionApp: [
      'Studio → Publicidad: plan “Empresarial”, prioridad ≥ 10, activar “Exclusivo en app”.',
      'Misma marca en todos los tipos de banner (opcional); la app oculta a otros anunciantes mientras dure.',
      'Studio → Programa del bloque (ej. Matinal): patrocinador + color, o se toma de la campaña exclusiva.',
      'Comprobar en /, /participa, /programacion y /patrocinadores antes de entregar al cliente.',
    ],
    gestionFm: [
      'Bloque fijo en parrilla + menciones conductor + 12 pases distribuidos.',
    ],
    alertas: [
      'Semana exclusiva = pausar otros premium o bajar su prioridad.',
      'Revisar /patrocinadores: agrupa por cliente automáticamente.',
    ],
  },
]

export function getAdPlanRule(plan: SponsorPlanId): AdPlanRule {
  return AD_PLAN_RULES.find(r => r.id === plan) ?? AD_PLAN_RULES[0]
}

export function isTipoAllowedForPlan(tipo: string, plan: SponsorPlanId | undefined): boolean {
  if (!plan) return true
  const rule = getAdPlanRule(plan)
  return rule.allowedTipos.includes(tipo as AdBannerTipo)
}

export function planLabel(plan: SponsorPlanId): string {
  return getAdPlanRule(plan).nombre
}
