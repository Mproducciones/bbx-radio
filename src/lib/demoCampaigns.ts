import { RADIO_AD } from '@/lib/radioAdBranding'

/** Campañas demo cuando Sanity no tiene publicidad activa (demo comercial). */

export type DemoAd = {
  _id: string
  nombre: string
  cliente: string
  tipo: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
  enlace?: string
  activo: boolean
  prioridad: number
  planContratado?: string
  exclusivoApp?: boolean
}

const WA = 'https://wa.me/56950291592'

function ad(
  id: string,
  cliente: string,
  tipo: string,
  opts: Partial<DemoAd> = {},
): DemoAd {
  return {
    _id: `demo-${id}`,
    nombre: opts.nombre ?? cliente,
    cliente,
    tipo,
    tagline: opts.tagline,
    cta: opts.cta ?? 'Ver más',
    colorAccent: opts.colorAccent ?? '#db8918',
    imagenUrl: opts.imagenUrl,
    enlace: opts.enlace ?? '/anunciate',
    activo: true,
    prioridad: opts.prioridad ?? 1,
    ...opts,
  }
}

export const DEMO_ADS_BY_TIPO: Record<string, DemoAd[]> = {
  banner_premium: [
    ad('premium-bienvenida', 'Supermercado El Ahorro', 'banner_premium', {
      tagline: `Las mejores ofertas en ${RADIO_AD.city} · 2×1 esta semana`,
      cta: 'Ver oferta',
      colorAccent: '#7D59B5',
      imagenUrl: '/ads/ahorro-premium.svg',
      enlace: WA,
      prioridad: 10,
    }),
  ],
  banner_superior: [
    ad('superior-automundo', 'AutoMundo Rancagua', 'banner_superior', {
      tagline: `Tu próximo auto en ${RADIO_AD.city}`,
      cta: 'Ver catálogo',
      colorAccent: '#40B9BF',
      imagenUrl: '/ads/automundo-superior.svg',
      enlace: WA,
      prioridad: 3,
    }),
    ad('superior-clinica', 'Clínica Bienvenida', 'banner_superior', {
      tagline: 'Agenda tu hora hoy · Salud familiar',
      cta: 'Agendar',
      colorAccent: '#db8918',
      imagenUrl: '/ads/clinica-superior.svg',
      enlace: WA,
      prioridad: 2,
    }),
  ],
  banner_intermedio: [
    ad('mid-constructora', 'Constructora Del Valle', 'banner_intermedio', {
      tagline: "Tu casa soñada en O'Higgins",
      cta: 'Ver proyectos',
      imagenUrl: '/ads/constructora-intermedio.svg',
      enlace: WA,
    }),
    ad('mid-pizza', 'Pizza Italiana', 'banner_intermedio', {
      tagline: 'Delivery en 30 min',
      cta: 'Pedir ahora',
      colorAccent: '#FF8C42',
      imagenUrl: '/ads/pizza-intermedio.svg',
      enlace: WA,
      prioridad: 2,
    }),
  ],
  banner_inferior: [
    ad('inf-farmacia', 'Farmacia Cruz Verde', 'banner_inferior', {
      tagline: 'Medicamentos y perfumería',
      cta: 'Ubicaciones',
      colorAccent: '#40B9BF',
      imagenUrl: '/ads/farmacia-inferior.svg',
      enlace: WA,
    }),
    ad('inf-pauta', RADIO_AD.stationName, 'banner_inferior', {
      tagline: RADIO_AD.pautaTagline,
      cta: 'Anunciate',
      enlace: '/anunciate',
      imagenUrl: '/ads/radio-anunciate.svg',
      prioridad: 5,
    }),
  ],
}

export const DEMO_SPONSORS = [
  {
    id: 'demo-premium-ahorro',
    name: 'Supermercado El Ahorro',
    cliente: 'Supermercado El Ahorro',
    tagline: 'Banner premium · Ofertas de la semana',
    imagenUrl: '/ads/ahorro-premium.svg',
    enlace: WA,
    colorAccent: '#7D59B5',
    tipos: ['banner_premium'],
  },
  {
    id: 'demo-superior-automundo',
    name: 'AutoMundo Rancagua',
    cliente: 'AutoMundo Rancagua',
    tagline: 'Tu próximo auto te está esperando',
    imagenUrl: '/ads/automundo-superior.svg',
    enlace: WA,
    colorAccent: '#40B9BF',
    tipos: ['banner_superior'],
  },
  {
    id: 'demo-superior-clinica',
    name: 'Clínica Bienvenida',
    cliente: 'Clínica Bienvenida',
    tagline: 'Salud para toda la familia',
    imagenUrl: '/ads/clinica-superior.svg',
    enlace: WA,
    colorAccent: '#db8918',
    tipos: ['banner_superior'],
  },
  {
    id: 'demo-mid-constructora',
    name: 'Constructora Del Valle',
    cliente: 'Constructora Del Valle',
    tagline: "Proyectos en O'Higgins",
    imagenUrl: '/ads/constructora-intermedio.svg',
    enlace: WA,
    colorAccent: '#db8918',
    tipos: ['banner_intermedio'],
  },
  {
    id: 'demo-mid-pizza',
    name: 'Pizza Italiana',
    cliente: 'Pizza Italiana',
    tagline: 'Delivery en 30 min',
    imagenUrl: '/ads/pizza-intermedio.svg',
    enlace: WA,
    colorAccent: '#FF8C42',
    tipos: ['banner_intermedio'],
  },
  {
    id: 'demo-inf-farmacia',
    name: 'Farmacia Cruz Verde',
    cliente: 'Farmacia Cruz Verde',
    tagline: 'Cerca de ti',
    imagenUrl: '/ads/farmacia-inferior.svg',
    enlace: WA,
    colorAccent: '#40B9BF',
    tipos: ['banner_inferior'],
  },
]

export function getDemoAds(tipo: string, tierOverrides?: Record<string, DemoAd[]>): DemoAd[] {
  if (tierOverrides?.[tipo]?.length) return tierOverrides[tipo]
  return DEMO_ADS_BY_TIPO[tipo] ?? []
}

export function shouldUseDemoAds(): boolean {
  return process.env.NEXT_PUBLIC_FORCE_DEMO_ADS === 'true'
}
