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
}

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
      tagline: 'Las mejores ofertas en Rancagua',
      colorAccent: '#7D59B5',
      enlace: 'https://wa.me/56950291592',
      prioridad: 10,
    }),
  ],
  banner_superior: [
    ad('superior-automundo', 'AutoMundo Rancagua', 'banner_superior', {
      tagline: 'Tu próximo auto te está esperando',
      colorAccent: '#40B9BF',
    }),
    ad('superior-clinica', 'Clínica Bienvenida', 'banner_superior', {
      tagline: 'Agenda tu hora hoy',
      colorAccent: '#db8918',
      prioridad: 2,
    }),
  ],
  banner_intermedio: [
    ad('mid-constructora', 'Constructora Del Valle', 'banner_intermedio', {
      tagline: "Tu casa soñada en O'Higgins",
    }),
    ad('mid-pizza', 'Pizza Italiana', 'banner_intermedio', {
      tagline: 'Delivery en 30 min',
      colorAccent: '#FF8C42',
    }),
  ],
  banner_inferior: [
    ad('inf-farmacia', 'Farmacia Cruz Verde', 'banner_inferior', {
      tagline: 'Medicamentos y perfumería',
      colorAccent: '#40B9BF',
    }),
    ad('inf-pauta', 'Radio Bienvenida', 'banner_inferior', {
      tagline: 'Pauta en 93.3 FM + app',
      cta: 'Anunciate',
      enlace: '/anunciate',
      prioridad: 5,
    }),
  ],
}

export const DEMO_SPONSORS = [
  {
    id: 'demo-superior-automundo',
    name: 'AutoMundo Rancagua',
    cliente: 'AutoMundo Rancagua',
    tagline: 'Tu próximo auto te está esperando',
    enlace: 'https://wa.me/56950291592',
    colorAccent: '#40B9BF',
    tipos: ['banner_superior'],
  },
  {
    id: 'demo-superior-clinica',
    name: 'Clínica Bienvenida',
    cliente: 'Clínica Bienvenida',
    tagline: 'Salud para toda la familia',
    colorAccent: '#db8918',
    tipos: ['banner_superior'],
  },
  {
    id: 'demo-mid-constructora',
    name: 'Constructora Del Valle',
    cliente: 'Constructora Del Valle',
    tagline: "Proyectos en O'Higgins",
    colorAccent: '#db8918',
    tipos: ['banner_intermedio'],
  },
  {
    id: 'demo-inf-farmacia',
    name: 'Farmacia Cruz Verde',
    cliente: 'Farmacia Cruz Verde',
    tagline: 'Cerca de ti',
    colorAccent: '#40B9BF',
    tipos: ['banner_inferior'],
  },
]

export function getDemoAds(tipo: string): DemoAd[] {
  return DEMO_ADS_BY_TIPO[tipo] ?? []
}
