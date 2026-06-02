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
  eyebrow: 'Publicidad · Radio + App',
  title: 'Tu negocio en el dial y en el bolsillo del oyente',
  subtitle: `Llega a la audiencia de ${RADIO.city} y la región con spots en ${RADIO.frequency} y presencia destacada en nuestra app.`,
}

export const SPONSOR_STATS = [
  { value: '+15K', label: 'Alcance mensual', accent: '#db8918' },
  { value: 'live', label: 'Oyentes en vivo', accent: '#40B9BF', live: true },
  { value: '20+', label: 'Años en el aire', accent: '#7D59B5' },
  { value: '93.3', label: 'FM · Rancagua', accent: '#00D9A0' },
] as const

export const SPONSOR_CHANNELS = [
  {
    id: 'radio',
    title: 'Al aire en FM',
    desc: 'Spots de 30 segundos en la programación que la gente escucha en auto, trabajo y casa.',
    accent: '#db8918',
  },
  {
    id: 'app',
    title: 'En la app',
    desc: 'Banner visible mientras reproducen en vivo. Tu marca junto al reproductor, no en un sitio olvidado.',
    accent: '#40B9BF',
  },
  {
    id: 'region',
    title: "Región O'Higgins",
    desc: "Audiencia local con intención real: comercio, servicios y marcas que venden en la región de O'Higgins.",
    accent: '#7D59B5',
  },
] as const

export const SPONSOR_STEPS = [
  { step: '01', title: 'Elige tu plan', desc: 'Básico, Premium o Empresarial según tu objetivo y presupuesto.' },
  { step: '02', title: 'Arte y mensaje', desc: 'Te ayudamos con banner y copy del spot si lo necesitas.' },
  { step: '03', title: 'Salís al aire', desc: 'Activación en radio y app. Reporte de alcance cada mes.' },
] as const

export const SPONSOR_FAQ = [
  {
    q: '¿Puedo empezar con un plan chico?',
    a: 'Sí. El plan Básico es ideal para probar radio + app con inversión controlada.',
  },
  {
    q: '¿Qué necesito para el banner?',
    a: 'Logo y texto de oferta. Si no tienes diseño, usamos plantilla profesional sin costo extra en la primera campaña.',
  },
  {
    q: '¿Los spots los graban ustedes?',
    a: 'Podemos grabar o usar tu audio. Revisamos guión y duración antes de salir al aire.',
  },
  {
    q: '¿Hay compromiso de permanencia?',
    a: 'Trabajamos por mes renovable. Te recomendamos mínimo 2 meses para medir resultados.',
  },
] as const
