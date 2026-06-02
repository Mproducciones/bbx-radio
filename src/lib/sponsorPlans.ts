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
    tagline: 'Presencia constante en la app y en la radio',
    features: ['4 spots al día', 'Banner en la app'],
    idealPara: 'Negocios locales, promociones del mes y marcas que quieren empezar a probar la radio.',
    detalle:
      'Tu marca aparece en la app mientras miles de personas escuchan en Rancagua y la región. Spots en horarios rotativos y banner visible en secciones clave de la PWA.',
    incluye: [
      '4 menciones spot de 30 s distribuidas en el día',
      'Banner estándar en la app (rotación con otros anuncios)',
      'Nombre de tu negocio en la sección de patrocinadores',
      'Reporte mensual de impresiones estimadas',
      'Arte del banner: te ayudamos con plantilla si no tienes diseño',
    ],
    imagenes: [
      { id: 'banner', caption: 'Banner en la app mientras escuchan' },
      { id: 'spot', caption: 'Spot de 30 s en la programación' },
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '150.000',
    color: '#db8918',
    popular: true,
    tagline: 'Máxima visibilidad en horario peak',
    features: ['8 spots horario peak', 'Banner destacado'],
    idealPara: 'Retail, restaurantes, clínicas y campañas que buscan volumen en mañana y tarde.',
    detalle:
      'Concentramos tus spots cuando hay más gente conectada: entrada al trabajo, almuerzo y vuelta a casa. Tu banner no compite en igualdad: va destacado con color de marca.',
    incluye: [
      '8 spots de 30 s en franjas peak (mañana y tarde)',
      'Banner destacado con borde y prioridad visual',
      'Posición preferente en pantalla En Vivo (sin tapar controles)',
      'Mención en redes de la radio (1 publicación/mes)',
      'Ajuste de copy del spot con nuestro equipo',
      'Prioridad en renovación de campaña',
    ],
    imagenes: [
      { id: 'banner-hero', caption: 'Banner destacado en En Vivo' },
      { id: 'peak', caption: 'Spots en horarios de mayor audiencia' },
      { id: 'stats', caption: 'Alcance regional + oyentes en vivo' },
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    precio: '250.000',
    color: '#7D59B5',
    tagline: 'Patrocinio de programa y presencia integral',
    features: ['12 spots · todos los horarios', 'Patrocinio de programa'],
    idealPara: 'Marcas consolidadas, cadenas, instituciones y campañas de largo plazo.',
    detalle:
      'Tu marca se asocia a un bloque de programación (“Presenta: Tu Empresa”). Cobertura en todos los horarios, menciones del conductor y presencia premium en app y piezas especiales.',
    incluye: [
      '12 spots diarios distribuidos en toda la parrilla',
      'Patrocinio nominal de programa o sección fija',
      'Banner exclusivo sin rotación en semanas acordadas',
      'Menciones en vivo por locutor (guión aprobado)',
      'Presencia en grilla de programación dentro de la app',
      '2 piezas gráficas para redes de la radio',
      'Reunión mensual de resultados con ventas',
    ],
    imagenes: [
      { id: 'programa', caption: '“Presenta: tu marca” en un programa' },
      { id: 'parrilla', caption: 'Visible en la grilla de la app' },
      { id: 'integral', caption: 'Cobertura en radio + digital' },
    ],
  },
]

export function getSponsorPlan(id: SponsorPlanId): SponsorPlan | undefined {
  return SPONSOR_PLANS.find(p => p.id === id)
}
