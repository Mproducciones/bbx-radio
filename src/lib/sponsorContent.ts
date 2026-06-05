import { RADIO } from '@/lib/radioConfig'

export const SPONSOR_WA = '56950291592'

export function sponsorWhatsApp(message: string) {
  return `https://wa.me/${SPONSOR_WA}?text=${encodeURIComponent(message)}`
}

export function sponsorWaLink(plan?: string) {
  const text = plan
    ? `Hola, me interesa el plan ${plan} en ${RADIO.name}. Quisiera más información.`
    : `Hola, quiero anunciar mi negocio en ${RADIO.name} (${RADIO.frequency}).`
  return sponsorWhatsApp(text)
}

export const SPONSOR_HERO = {
  eyebrow: 'Publicidad · Radio Bienvenida',
  title: 'Llega a quien escucha y a quien mira el celular',
  subtitle: `Spots en ${RADIO.frequency} + banner en la app. Una sola campaña, dos pantallas: el auto, el trabajo y el bolsillo del oyente en ${RADIO.city}.`,
}

export const SPONSOR_STATS = [
  { value: 'FM', label: 'Spots en cabina', accent: '#db8918' },
  { value: 'live', label: 'Oyentes en vivo', accent: '#40B9BF', live: true as const },
  { value: 'App', label: 'Banners medibles', accent: '#7D59B5' },
  { value: '93.3', label: 'FM · Rancagua', accent: '#00D9A0' },
] as const

export type SponsorValueLine = {
  id: string
  title: string
  color: string
  hook: string
  benefit: string
  image: string
  breakdown: { label: string; value: string }[]
  tip: string
}

export const SPONSOR_VALUE = {
  title: 'Qué obtiene tu negocio',
  intro: 'No compras solo “un spot”: compras presencia en la radio que la gente de la región escucha todos los días, más visibilidad digital mientras usan la app.',
  lines: [
    {
      id: 'fm',
      title: 'Spots en FM 93.3',
      color: '#db8918',
      hook: 'Tu mensaje en la programación diaria.',
      image: '/sponsor/fm.png',
      benefit: 'Ideal para ofertas, aperturas y recordar tu marca. El oyente te escucha en contexto local: confianza y cercanía que un banner online solo no da.',
      breakdown: [
        { label: 'Formato', value: 'Spot 30 segundos' },
        { label: 'Plan Básico', value: '4 pases / día' },
        { label: 'Plan Premium', value: '8 pases horario peak' },
        { label: 'Plan Empresarial', value: '12 pases + programa' },
      ],
      tip: 'Los spots se programan en cabina. Podemos coordinar grabación o guión con el equipo comercial.',
    },
    {
      id: 'app',
      title: 'Banner en la app',
      color: '#40B9BF',
      hook: 'Visible mientras escuchan en vivo.',
      image: '/sponsor/app.png',
      benefit: 'Banners en En Vivo (bajo el play), Participa, Noticias, Saludos y Grilla — según el plan. Sin prometer pantallas que no existen.',
      breakdown: [
        { label: 'Plan Básico', value: 'Banner rotativo + En Vivo' },
        { label: 'Plan Premium', value: 'Destacado En Vivo + flotante' },
        { label: 'Plan Empresarial', value: 'Exclusivo + badge grilla' },
        { label: 'Arte', value: 'Coordinamos banner (plantilla si no tienes diseño)' },
      ],
      tip: 'Pide ver ejemplos en cada plan: mostramos mockups reales de la app.',
    },
    {
      id: 'region',
      title: 'Audiencia O\'Higgins',
      color: '#7D59B5',
      hook: 'Gente local con intención de compra.',
      image: '/sponsor/region.png',
      benefit: 'Restaurantes, clínicas, retail y servicios que venden en el territorio. Llegas a quien vive y trabaja en la zona, no a clics genéricos.',
      breakdown: [
        { label: 'Ciudad foco', value: RADIO.city },
        { label: 'Medio', value: 'FM + PWA instalable' },
        { label: 'Reporte app', value: 'Impresiones y clics reales del banner' },
        { label: 'Alcance FM', value: 'Según parrilla y cabina (no medido en app)' },
      ],
      tip: 'Combina radio + app para campañas de apertura o promociones de temporada.',
    },
  ] satisfies SponsorValueLine[],
}

export const SPONSOR_CHANNELS = [
  { id: 'radio', title: 'Al aire', desc: 'FM en auto, trabajo y casa.', accent: '#db8918' },
  { id: 'app', title: 'En la app', desc: 'Banners verificables en la PWA.', accent: '#40B9BF' },
  { id: 'region', title: 'Local', desc: 'Audiencia de la región.', accent: '#7D59B5' },
] as const

export const SPONSOR_STEPS = [
  { step: '01', title: 'Elige plan', desc: 'Básico, Premium o Empresarial.' },
  { step: '02', title: 'Arte y spot', desc: 'Coordinamos banner (app) y audio FM con cabina.' },
  { step: '03', title: 'Al aire', desc: 'Activamos banners en la app + spots en radio + reporte mensual.' },
] as const

export const SPONSOR_FAQ = [
  { q: '¿Puedo empezar pequeño?', a: 'Sí. El plan Básico ($80.000/mes) es ideal para probar.' },
  { q: '¿Necesito diseño?', a: 'No es obligatorio. Si no tienes banner, coordinamos una plantilla con el equipo comercial.' },
  { q: '¿Graban el spot?', a: 'Los spots suenan en FM 93.3 (cabina). Podemos coordinar grabación o usar tu audio; no se administra desde la app.' },
  { q: '¿Hay permanencia?', a: 'Mes a mes. Recomendamos 2 meses para medir resultados.' },
  {
    q: '¿Qué funciones puedo probar ya en la app?',
    a: 'En la app: banners en En Vivo, Participa, Grilla, etc.; patrocinadores en /patrocinadores; badge de programa en /programacion (Empresarial). Reporte y spots FM son gestión comercial (/admin y cabina), no pantallas públicas.',
  },
] as const

export const SPONSOR_LIVE = [
  { label: 'En Vivo (bajo el play)', href: '/', status: 'En app', note: 'Básico rotativo · Premium destacado · Empresarial exclusivo' },
  { label: 'Banner premium flotante', href: '/participa', status: 'En app', note: 'Premium y Empresarial · no tapa el play' },
  { label: 'Banners rotativos', href: '/programacion', status: 'En app', note: 'Grilla, Noticias, Participa, Saludos' },
  { label: 'Patrocinio en grilla', href: '/programacion', status: 'En app', note: '“Presenta: …” en Studio o campaña Empresarial' },
  { label: 'Sorteo patrocinado', href: '/participa', status: 'En app', note: 'Tab Sorteo · registros reales' },
  { label: 'Patrocinadores', href: '/patrocinadores', status: 'En app', note: 'Marcas con campaña activa de ejemplo' },
  { label: 'Reporte mensual', href: '/admin', status: 'Panel admin', note: 'CSV + WhatsApp anunciante' },
  { label: 'Spots FM 93.3', href: null, status: 'Cabina', note: 'Se activa al cerrar venta' },
] as const
