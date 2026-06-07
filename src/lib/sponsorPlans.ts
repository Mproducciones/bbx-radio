import { incluyeLabelsFromDeliverables } from '@/lib/sponsorPlanDeliverables'
import { enVivoAdSalesLine } from '@/lib/enVivoAdSchedule'

export type SponsorPlanId = 'basico' | 'premium' | 'empresarial'

export type PlanMockupKind =
  | 'banner'
  | 'spot'
  | 'banner-hero'
  | 'peak'
  | 'stats'
  | 'programa'
  | 'parrilla'
  | 'integral'

export type SponsorPlanImage = {
  id: PlanMockupKind
  caption: string
  visualNote: string
  callouts: string[]
}

export type SponsorPlan = {
  id: SponsorPlanId
  nombre: string
  precio: string
  color: string
  popular?: boolean
  tagline: string
  features: string[]
  idealPara: string
  detalle: string
  incluye: string[]
  imagenes: SponsorPlanImage[]
}

export const SPONSOR_PLANS: SponsorPlan[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: '80.000',
    color: '#40B9BF',
    tagline: 'Presencia en la app y spots en la radio',
    features: ['Banner rotativo + En Vivo por intervalos', '4 spots al día en FM (cabina)'],
    idealPara: 'Negocios locales, promociones del mes y marcas que quieren empezar a probar la radio.',
    detalle:
      'Tu banner aparece en secciones clave de la PWA. En En Vivo se muestra por intervalos (no fijo) para no tapar el reproductor. Los spots suenan al aire en horarios acordados con cabina.',
    incluye: incluyeLabelsFromDeliverables('basico'),
    imagenes: [
      {
        id: 'banner',
        caption: 'Banner en En Vivo',
        callouts: ['Por intervalos', 'Rota con otros', 'Logo + oferta'],
        visualNote:
          `En En Vivo el banner aparece debajo del reproductor unos segundos y desaparece — ${enVivoAdSalesLine('standard').toLowerCase()}. Si hay varias campañas Básico, rotan en cada aparición.`,
      },
      {
        id: 'spot',
        caption: 'Spot en FM 93.3',
        callouts: ['4× al día', '30 segundos', 'Locutor en cabina'],
        visualNote:
          'El audio se programa en la radio; no se administra desde la app. Ideal para promos con teléfono y dirección.',
      },
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '150.000',
    color: '#db8918',
    popular: true,
    tagline: 'Banner destacado + presencia flotante en la app',
    features: ['Destacado En Vivo (intervalos)', 'Banner flotante', '8 spots peak (cabina)'],
    idealPara: 'Retail, restaurantes, clínicas y campañas que buscan volumen en mañana y tarde.',
    detalle:
      'Banner “Destacado” en En Vivo por intervalos (más tiempo visible que Básico), más banner flotante en Participa, Saludos y Grilla. Spots concentrados en horarios de mayor sintonía.',
    incluye: incluyeLabelsFromDeliverables('premium'),
    imagenes: [
      {
        id: 'banner-hero',
        caption: 'Destacado en En Vivo',
        callouts: ['Por intervalos', 'Borde destacado', 'Prioridad visual'],
        visualNote:
          `Campaña banner premium activa: el oyente la ve destacada en En Vivo ${enVivoAdSalesLine('highlighted').replace('En En Vivo: ', '')}, además del banner flotante en otras secciones.`,
      },
      {
        id: 'peak',
        caption: 'Grilla horario peak',
        callouts: ['07–10 h', '13–15 h', '18–21 h', '8 spots/día'],
        visualNote:
          'Los 8 pases FM se coordinan en cabina en franjas peak. La app muestra tus banners; el audio es independiente.',
      },
      {
        id: 'stats',
        caption: 'Reporte mensual',
        callouts: ['Impresiones', 'Clics', 'Alcance'],
        visualNote:
          'Métricas reales del banner en el panel comercial de la radio (/admin). No es una pantalla pública para el anunciante.',
      },
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    precio: '250.000',
    color: '#7D59B5',
    tagline: 'Patrocinio de programa + exclusividad en app',
    features: ['Exclusivo en app', 'Badge en grilla', '12 spots FM (cabina)'],
    idealPara: 'Marcas consolidadas, cadenas, instituciones y campañas de largo plazo.',
    detalle:
      'Con “Exclusivo en app” activo, solo tu marca aparece en los banners de la PWA. Badge “Presenta: [marca]” en el bloque patrocinado de la grilla (Studio o campaña exclusiva). Spots y menciones FM las programa cabina.',
    incluye: incluyeLabelsFromDeliverables('empresarial'),
    imagenes: [
      {
        id: 'programa',
        caption: 'Patrocinio de bloque',
        callouts: ['“Presenta: tu marca”', 'FM + app', 'Locutor'],
        visualNote:
          'En Studio → Programa asignas patrocinador al bloque (ej. Matinal). En la app se ve el badge; en FM van menciones y spots acordados.',
      },
      {
        id: 'parrilla',
        caption: 'Badge en programación',
        callouts: ['Grilla de la app', 'Presenta: …', 'Color de marca'],
        visualNote:
          'En /programacion cada bloque patrocinado muestra “Presenta: [cliente]” con el color configurado en Studio.',
      },
      {
        id: 'integral',
        caption: 'Cobertura integral',
        callouts: ['FM 12 spots', 'App exclusiva', 'Redes (gestión)'],
        visualNote:
          `En la app: banner exclusivo por intervalos en En Vivo (${enVivoAdSalesLine('exclusive').replace('En En Vivo: ', '')}). Spots FM, menciones locutor y piezas en redes se coordinan con el equipo comercial — no son pantallas de la PWA.`,
      },
    ],
  },
]

export function getSponsorPlan(id: SponsorPlanId): SponsorPlan | undefined {
  return SPONSOR_PLANS.find(p => p.id === id)
}
