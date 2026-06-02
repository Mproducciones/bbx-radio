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
      {
        id: 'banner',
        caption: 'Banner en En Vivo',
        callouts: ['Debajo del play', 'Rota con otros', 'Logo + texto tuyo'],
        visualNote:
          'Cuando el oyente abre la app, tu banner aparece fijo bajo el reproductor. Comparte espacio con otros anuncios — cada ~30 s cambia. Subimos tu arte o te damos plantilla.',
      },
      {
        id: 'spot',
        caption: 'Spot en FM 93.3',
        callouts: ['4× al día', '30 segundos', 'Locutor en cabina'],
        visualNote:
          'No es pantalla: es audio al aire en estos horarios. El locutor lee tu guión mientras miles escuchan en auto, trabajo o celular. Ideal para promos con dirección y teléfono.',
      },
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
      {
        id: 'banner-hero',
        caption: 'Banner destacado',
        callouts: ['Borde dorado', 'Sin competir igual', 'Siempre visible'],
        visualNote:
          'Mismo lugar que el Básico, pero tu banner lleva borde, badge “Destacado” y no se ve como los demás. El oyente lo identifica al instante al abrir En Vivo.',
      },
      {
        id: 'peak',
        caption: 'Grilla horario peak',
        callouts: ['07–10 h', '13–15 h', '18–21 h', '8 spots/día'],
        visualNote:
          'Concentramos tus 8 menciones cuando hay más sintonía: entrada al trabajo, almuerzo y vuelta a casa. El esquema muestra en qué franjas suena tu marca en FM.',
      },
      {
        id: 'stats',
        caption: 'Reporte mensual',
        callouts: ['Oyentes en vivo', 'Impresiones banner', 'Alcance regional'],
        visualNote:
          'Cada mes recibes números reales de la app: cuántos vieron tu banner, oyentes conectados y alcance estimado. Lo usás para renovar campañas con datos, no suposiciones.',
      },
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
      {
        id: 'programa',
        caption: 'Patrocinio de bloque',
        callouts: ['“Presenta: tu marca”', 'Cortina al inicio', 'Locutor menciona'],
        visualNote:
          'Tu empresa aparece como auspicio del Matinal (u otro bloque fijo): cabecera visual, mención del conductor al arrancar y spots repartidos en ese programa. Asociación de marca fuerte.',
      },
      {
        id: 'parrilla',
        caption: 'Badge en programación',
        callouts: ['Grilla de la app', 'Badge Patrocinio', 'Todo el día visible'],
        visualNote:
          'En la sección Programación de la PWA, tu bloque patrocinado lleva badge y color de marca. El oyente ve tu nombre antes de sintonizar ese horario.',
      },
      {
        id: 'integral',
        caption: 'Mapa de cobertura',
        callouts: ['FM 12 spots', 'App exclusiva', 'Redes + locutor'],
        visualNote:
          'Vista esquemática de los 3 canales activos a la vez: radio con cobertura total del día, banner sin rotación en semanas acordadas, y piezas en redes que arma la radio con tu logo.',
      },
    ],
  },
]

export function getSponsorPlan(id: SponsorPlanId): SponsorPlan | undefined {
  return SPONSOR_PLANS.find(p => p.id === id)
}
