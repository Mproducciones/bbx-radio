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
  { value: '+15K', label: 'Alcance mensual', accent: '#db8918' },
  { value: 'live', label: 'Oyentes en vivo', accent: '#40B9BF', live: true as const },
  { value: '20+', label: 'Años al aire', accent: '#7D59B5' },
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
  intro: 'No comprás solo “un spot”: comprás presencia en la radio que la gente de la región escucha todos los días, más visibilidad digital mientras usan la app.',
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
      tip: 'Grabamos o usamos tu audio. Te ayudamos con guión si lo necesitas.',
    },
    {
      id: 'app',
      title: 'Banner en la app',
      color: '#40B9BF',
      hook: 'Visible mientras escuchan en vivo.',
      image: '/sponsor/app.png',
      benefit: 'Tu logo y oferta junto al reproductor — no en una web que nadie abre. El anunciante ve dónde aparece antes de contratar.',
      breakdown: [
        { label: 'Plan Básico', value: 'Banner estándar rotativo' },
        { label: 'Plan Premium', value: 'Banner destacado En Vivo' },
        { label: 'Plan Empresarial', value: 'Semanas exclusivas' },
        { label: 'Arte', value: 'Plantilla incluida si no tienes diseño' },
      ],
      tip: 'Pedí ver ejemplos en cada plan: mostramos mockups reales de la app.',
    },
    {
      id: 'region',
      title: 'Audiencia O\'Higgins',
      color: '#7D59B5',
      hook: 'Gente local con intención de compra.',
      image: '/sponsor/region.png',
      benefit: 'Restaurantes, clínicas, retail y servicios que venden en el territorio. Llegás a quien vive y trabaja en la zona, no a clics genéricos.',
      breakdown: [
        { label: 'Ciudad foco', value: RADIO.city },
        { label: 'Alcance referencial', value: '+15.000 / mes' },
        { label: 'Medio', value: 'FM + PWA instalable' },
        { label: 'Reporte', value: 'Impresiones estimadas / mes' },
      ],
      tip: 'Combiná radio + app para campañas de apertura o promociones de temporada.',
    },
  ] satisfies SponsorValueLine[],
}

export const SPONSOR_CHANNELS = [
  { id: 'radio', title: 'Al aire', desc: 'FM en auto, trabajo y casa.', accent: '#db8918' },
  { id: 'app', title: 'En la app', desc: 'Banner junto al play en vivo.', accent: '#40B9BF' },
  { id: 'region', title: 'Local', desc: 'Audiencia de la región.', accent: '#7D59B5' },
] as const

export const SPONSOR_STEPS = [
  { step: '01', title: 'Elige plan', desc: 'Básico, Premium o Empresarial.' },
  { step: '02', title: 'Arte y spot', desc: 'Te ayudamos con banner y guión.' },
  { step: '03', title: 'Al aire', desc: 'Radio + app + reporte mensual.' },
] as const

export const SPONSOR_FAQ = [
  { q: '¿Puedo empezar pequeño?', a: 'Sí. El plan Básico ($80.000/mes) es ideal para probar.' },
  { q: '¿Necesito diseño?', a: 'No obligatorio. Usamos plantilla profesional en la primera campaña.' },
  { q: '¿Graban el spot?', a: 'Podemos grabarlo o usar tu audio revisado por nuestro equipo.' },
  { q: '¿Hay permanencia?', a: 'Mes a mes. Recomendamos 2 meses para medir resultados.' },
  {
    q: '¿Qué funciones puedo probar ya en la app?',
    a: 'Banners con impresiones/clics (En Vivo y Participá), sorteos en Participá → Sorteo, reporte mensual en /admin, y patrocinadores en /patrocinadores. Los spots FM los coordina cabina al contratar.',
  },
] as const

export const SPONSOR_LIVE = [
  { label: 'Banner en En Vivo', href: '/', status: 'En app', note: 'Banners rotativos bajo el play' },
  { label: 'Sorteo patrocinado', href: '/participa', status: 'En app', note: 'Tab Sorteo · registros reales' },
  { label: 'Reporte mensual', href: '/admin', status: 'Panel admin', note: 'CSV + WhatsApp anunciante' },
  { label: 'Patrocinadores', href: '/patrocinadores', status: 'En app', note: 'Marcas con campaña activa' },
  { label: 'Spots FM 93.3', href: null, status: 'Cabina', note: 'Se activa al cerrar venta' },
] as const
