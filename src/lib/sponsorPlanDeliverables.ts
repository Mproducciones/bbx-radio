import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { enVivoAdSalesLine } from '@/lib/enVivoAdSchedule'

export type DeliverableChannel = 'app' | 'fm' | 'gestion'

export type PlanDeliverable = {
  id: string
  label: string
  channel: DeliverableChannel
  /** Implementado en la PWA (el oyente lo puede ver). */
  inApp: boolean
  /** Ruta para comprobar en vivo (ventas / cliente). */
  previewHref?: string
  note?: string
}

const CHANNEL_LABEL: Record<DeliverableChannel, string> = {
  app: 'En la app',
  fm: 'En FM 93.3',
  gestion: 'Gestión comercial',
}

export function channelLabel(ch: DeliverableChannel): string {
  return CHANNEL_LABEL[ch]
}

/** Lo que cada plan debe cumplir — alineado al código de la PWA. */
export const PLAN_DELIVERABLES: Record<SponsorPlanId, PlanDeliverable[]> = {
  basico: [
    {
      id: 'banner-rotativo',
      label: 'Banner en Participa, Noticias, Saludos y Grilla (rotación)',
      channel: 'app',
      inApp: true,
      previewHref: '/participa',
    },
    {
      id: 'banner-envivo',
      label: 'Banner en En Vivo por intervalos (no fijo)',
      channel: 'app',
      inApp: true,
      previewHref: '/',
      note: enVivoAdSalesLine('standard'),
    },
    {
      id: 'spots-4',
      label: '4 spots de 30 s al día',
      channel: 'fm',
      inApp: false,
      note: 'Programación en cabina al activar la campaña.',
    },
    {
      id: 'reporte',
      label: 'Reporte mensual de impresiones y clics',
      channel: 'gestion',
      inApp: false,
      note: 'Panel /admin → Comercial (no es pantalla pública).',
    },
    {
      id: 'arte',
      label: 'Plantilla de banner si el cliente no tiene diseño',
      channel: 'gestion',
      inApp: false,
    },
  ],
  premium: [
    {
      id: 'banner-destacado-envivo',
      label: 'Banner destacado en En Vivo por intervalos',
      channel: 'app',
      inApp: true,
      previewHref: '/',
      note: enVivoAdSalesLine('highlighted'),
    },
    {
      id: 'banner-flotante',
      label: 'Banner premium flotante (Participa, Saludos, Grilla)',
      channel: 'app',
      inApp: true,
      previewHref: '/participa',
      note: 'No tapa el reproductor en En Vivo.',
    },
    {
      id: 'banner-rotativo',
      label: 'Banners rotativos en secciones del feed',
      channel: 'app',
      inApp: true,
      previewHref: '/noticias',
    },
    {
      id: 'spots-peak',
      label: '8 spots en horario peak',
      channel: 'fm',
      inApp: false,
      note: 'Franjas acordadas con producción.',
    },
    {
      id: 'redes',
      label: '1 mención en redes de la radio al mes',
      channel: 'gestion',
      inApp: false,
    },
    {
      id: 'reporte',
      label: 'Reporte mensual con métricas de banner',
      channel: 'gestion',
      inApp: false,
      note: '/admin → Comercial.',
    },
  ],
  empresarial: [
    {
      id: 'exclusivo-app',
      label: 'Banner premium exclusivo en app (sin rotación, prioridad alta)',
      channel: 'app',
      inApp: true,
      previewHref: '/participa',
      note: 'Marcar “Exclusivo en app” en Studio.',
    },
    {
      id: 'banner-envivo',
      label: 'Banner exclusivo en En Vivo por intervalos',
      channel: 'app',
      inApp: true,
      previewHref: '/',
      note: enVivoAdSalesLine('exclusive'),
    },
    {
      id: 'grilla-patrocinio',
      label: 'Badge “Presenta: [marca]” en bloque de programación',
      channel: 'app',
      inApp: true,
      previewHref: '/programacion',
      note: 'Studio → Programa, o automático si hay campaña Empresarial exclusiva activa.',
    },
    {
      id: 'spots-12',
      label: '12 spots diarios en toda la parrilla',
      channel: 'fm',
      inApp: false,
    },
    {
      id: 'locutor',
      label: 'Menciones en vivo del locutor (guión aprobado)',
      channel: 'fm',
      inApp: false,
    },
    {
      id: 'redes-2',
      label: '2 piezas gráficas en redes de la radio',
      channel: 'gestion',
      inApp: false,
    },
    {
      id: 'reunion',
      label: 'Reunión mensual de resultados',
      channel: 'gestion',
      inApp: false,
    },
  ],
}

export function deliverablesForPlan(planId: SponsorPlanId): PlanDeliverable[] {
  return PLAN_DELIVERABLES[planId]
}

export function inAppDeliverables(planId: SponsorPlanId): PlanDeliverable[] {
  return PLAN_DELIVERABLES[planId].filter(d => d.inApp)
}

export function incluyeLabelsFromDeliverables(planId: SponsorPlanId): string[] {
  return PLAN_DELIVERABLES[planId].map(d => {
    const prefix = d.channel === 'app' ? '' : d.channel === 'fm' ? '[FM] ' : '[Gestión] '
    return `${prefix}${d.label}`
  })
}
