import { RADIO } from '@/lib/radioConfig'
import {
  formatThousandsPlus,
  getYearsOnAir,
  RADIO_FM_FREQUENCIES_LABEL,
  RADIO_PUBLIC_FACTS,
} from '@/lib/radioPublicFacts'
import { EN_VIVO_AD_POLICY, enVivoAdSalesLine } from '@/lib/enVivoAdSchedule'

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
  subtitle: `${RADIO_PUBLIC_FACTS.coverageClaim}. Spots en FM + banner en la app: una campaña en antena y en el celular del oyente.`,
}

export const SPONSOR_STATS = [
  { value: String(RADIO_PUBLIC_FACTS.comunasRegion), label: 'Comunas O\'Higgins', accent: '#db8918' },
  { value: String(RADIO_PUBLIC_FACTS.fmSignals), label: 'Señales FM', accent: '#40B9BF' },
  {
    value: formatThousandsPlus(RADIO_PUBLIC_FACTS.socialFacebookMin),
    label: 'Comunidad en redes',
    accent: '#7D59B5',
  },
  { value: `${getYearsOnAir()}+`, label: 'Años al aire', accent: '#00D9A0' },
] as const

export const SPONSOR_STATS_SOURCE =
  'Cobertura y trayectoria: El Rancagüino · Comunidad digital: dato publicado por la emisora (2021)'

export function buildAnunciateHeroStats(liveListeners = 0) {
  const stats = SPONSOR_STATS.map(s => ({
    v: s.value,
    l: s.label.toLowerCase(),
    c:
      s.accent === '#db8918'
        ? 'var(--color-mag-400)'
        : s.accent === '#40B9BF'
          ? 'var(--color-cyn-400)'
          : s.accent === '#7D59B5'
            ? 'var(--color-pur-400)'
            : 'var(--color-pulso-success)',
  }))

  if (liveListeners > 0) {
    return [
      { v: String(liveListeners), l: 'oyentes en vivo ahora', c: 'var(--color-cyn-400)' },
      ...stats.slice(0, 3),
    ]
  }

  return stats
}

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
      hook: 'Visible mientras escuchan — sin tapar el play.',
      image: '/sponsor/app.png',
      benefit: 'Banners en Participa, Noticias, Saludos y Grilla. En En Vivo aparecen por intervalos — el reproductor queda libre la mayor parte del tiempo.',
      breakdown: [
        { label: 'Plan Básico', value: enVivoAdSalesLine('standard') },
        { label: 'Plan Premium', value: `${enVivoAdSalesLine('highlighted')} + flotante` },
        { label: 'Plan Empresarial', value: `${enVivoAdSalesLine('exclusive')} + badge grilla` },
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
      benefit: `Cubre las ${RADIO_PUBLIC_FACTS.comunasRegion} comunas con ${RADIO_PUBLIC_FACTS.fmSignals} señales FM. Comunidad digital de ${formatThousandsPlus(RADIO_PUBLIC_FACTS.socialFacebookMin)} seguidores en Facebook (dato publicado en prensa regional) más streaming y app.`,
      breakdown: [
        { label: 'Cobertura', value: `${RADIO_PUBLIC_FACTS.comunasRegion} comunas por antena` },
        { label: 'Frecuencias', value: RADIO_FM_FREQUENCIES_LABEL },
        { label: 'Trayectoria', value: `Desde ${RADIO_PUBLIC_FACTS.foundedYear} · ${getYearsOnAir()}+ años` },
        { label: 'Contexto Rancagua', value: `~${RADIO_PUBLIC_FACTS.rancaguaDailyRadioReachPct}% escucha radio algún día (Ipsos)` },
      ],
      tip: 'En la app medimos impresiones y clics del banner. El alcance FM depende de la parrilla acordada en cabina.',
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
    q: '¿Cuánta gente llega?',
    a: `Radio Bienvenida cubre las ${RADIO_PUBLIC_FACTS.comunasRegion} comunas de O'Higgins con ${RADIO_PUBLIC_FACTS.fmSignals} señales FM. La emisora reportó ${formatThousandsPlus(RADIO_PUBLIC_FACTS.socialFacebookMin)} seguidores en Facebook (El Rancagüino, 2021). En la app ves oyentes conectados en vivo; el reporte mensual trae impresiones y clics del banner. No publicamos rating Ipsos por emisora — el equipo comercial coordina pases FM según tu plan.`,
  },
  {
    q: '¿Qué funciones puedo probar ya en la app?',
    a: 'En la app: banners por intervalos en En Vivo (no fijos), Participa, Grilla, etc.; badge de programa en /programacion (Empresarial). Reporte y spots FM son gestión comercial (/admin y cabina), no pantallas públicas.',
  },
  {
    q: '¿El banner en En Vivo tapa el reproductor?',
    a: EN_VIVO_AD_POLICY,
  },
] as const

export const SPONSOR_LIVE = [
  { label: 'En Vivo (intervalos)', href: '/', status: 'En app', note: 'Básico ~8 s/53 s · Premium ~10 s/45 s · Empresarial ~12 s/40 s' },
  { label: 'Banner premium flotante', href: '/participa', status: 'En app', note: 'Premium y Empresarial · no tapa el play' },
  { label: 'Banners rotativos', href: '/programacion', status: 'En app', note: 'Grilla, Noticias, Participa, Saludos' },
  { label: 'Patrocinio en grilla', href: '/programacion', status: 'En app', note: '“Presenta: …” en Studio o campaña Empresarial' },
  { label: 'Sorteo patrocinado', href: '/participa', status: 'En app', note: 'Tab Sorteo · registros reales' },
  { label: 'Reporte mensual', href: '/admin', status: 'Panel admin', note: 'CSV + WhatsApp anunciante' },
  { label: 'Spots FM 93.3', href: null, status: 'Cabina', note: 'Se activa al cerrar venta' },
] as const
