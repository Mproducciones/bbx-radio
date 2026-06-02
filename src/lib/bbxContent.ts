export const BBX_CONTACT = {
  name: 'Bryan',
  phone: '56922105555',
  email: 'hola@bbxradio.cl',
}

export function bbxWhatsApp(message: string) {
  return `https://wa.me/${BBX_CONTACT.phone}?text=${encodeURIComponent(message)}`
}

export const BBX_HERO = {
  eyebrow: 'Plataforma white-label para radios',
  title: 'La app que tu radio merece',
  subtitle:
    'PWA instalable, reproductor en vivo, monetización digital y panel de control. Tu marca, tu dominio, tu audiencia — sin depender de una app genérica.',
  proof: 'Caso en producción: Radio Bienvenida 93.3 FM · Rancagua',
}

export const BBX_STATS = [
  { value: '48h', label: 'Implementación típica', accent: '#db8918' },
  { value: 'PWA', label: 'iOS y Android sin tienda', accent: '#40B9BF' },
  { value: '24/7', label: 'Streaming + analytics', accent: '#7D59B5' },
  { value: '100%', label: 'Marca de tu radio', accent: '#00D9A0' },
] as const

export const BBX_FEATURES = [
  {
    id: 'player',
    title: 'Reproductor premium',
    desc: 'Visualizador al ritmo, metadatos en vivo y experiencia tipo app nativa en cualquier celular.',
    accent: '#db8918',
  },
  {
    id: 'saludos',
    title: 'Saludos al aire',
    desc: 'El oyente envía mensajes; el locutor los ve en tiempo real. Fidelización que se siente en cabina.',
    accent: '#40B9BF',
  },
  {
    id: 'ads',
    title: 'Publicidad digital',
    desc: 'Banners rotativos, patrocinadores y métricas para vender espacios con datos, no solo intuición.',
    accent: '#7D59B5',
  },
  {
    id: 'tv',
    title: 'Radio + TV',
    desc: 'Audio y video en un solo lugar. Dos señales, una audiencia unificada.',
    accent: '#db8918',
  },
  {
    id: 'polls',
    title: 'Participación en vivo',
    desc: 'Votaciones, pedidos de tema y sorteos con captura de leads para tu base de datos.',
    accent: '#40B9BF',
  },
  {
    id: 'admin',
    title: 'Panel y CMS',
    desc: 'Programación, anuncios, contenidos y usuarios desde un backoffice pensado para operadores de radio.',
    accent: '#00D9A0',
  },
] as const

export const BBX_PROCESS = [
  { step: '01', title: 'Diagnóstico', desc: 'Revisamos tu stream, marca y objetivos comerciales.' },
  { step: '02', title: 'Diseño & setup', desc: 'Colores, logo, grilla y módulos activos en menos de 48 horas.' },
  { step: '03', title: 'Lanzamiento', desc: 'Publicación PWA, capacitación y soporte de arranque.' },
  { step: '04', title: 'Crecimiento', desc: 'Monetización, métricas y mejoras continuas con tu equipo.' },
] as const

export const BBX_REVENUE = {
  title: 'Ingresos adicionales estimados',
  subtitle: 'Ejemplo mensual para una radio regional con ventas activas',
  rows: [
    { item: '8 banners digitales', amount: '$400.000', color: '#db8918' },
    { item: '2 sorteos patrocinados', amount: '$160.000', color: '#40B9BF' },
    { item: 'Monetización programática', amount: '$30.000', color: '#7D59B5' },
  ],
  total: '$590.000',
  note: 'Estimación referencial. No incluye spots tradicionales al aire.',
}

export type BbxPlanId = 'esencial' | 'pro' | 'premium'

export type BbxPlan = {
  id: BbxPlanId
  nombre: string
  precio: string
  setup: string
  color: string
  popular?: boolean
  tagline: string
  features: string[]
  ideal: string
}

export const BBX_PLANS: BbxPlan[] = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    precio: '80.000',
    setup: '100.000',
    color: '#40B9BF',
    tagline: 'Tu radio en el bolsillo del oyente desde el día uno.',
    ideal: 'Radios que quieren presencia digital profesional sin complejidad.',
    features: [
      'PWA instalable · Android e iOS',
      'Reproductor en vivo con visualizador',
      'Programación con bloque EN VIVO',
      'Saludos al aire',
      'Señal de TV integrada',
    ],
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: '120.000',
    setup: '150.000',
    color: '#db8918',
    popular: true,
    tagline: 'Monetizá con publicidad digital y participación del oyente.',
    ideal: 'Emisoras que ya venden pauta y buscan un producto digital rentable.',
    features: [
      'Todo Esencial',
      'Sistema de banners (hasta 4 posiciones)',
      'Sorteos con captura de leads',
      'Votación y pedidos de tema',
      'Analytics de oyentes en tiempo real',
      'Panel admin + CMS completo',
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '160.000',
    setup: '200.000',
    color: '#7D59B5',
    tagline: 'Máxima identidad de marca y acompañamiento prioritario.',
    ideal: 'Grupos radiales y marcas que exigen dominio propio y presencia en tiendas.',
    features: [
      'Todo Pro',
      'APK para Google Play',
      'Dominio personalizado',
      'Módulo de lanzamientos',
      'Capacitación y soporte prioritario',
    ],
  },
]

export const BBX_FAQ = [
  {
    q: '¿Necesito publicar en App Store o Google Play?',
    a: 'No para empezar. La PWA se instala desde el navegador. En Premium podemos generar APK para Play Store.',
  },
  {
    q: '¿Funciona con mi streaming actual?',
    a: 'Sí. Integramos Icecast, Zeno, o la URL que ya uses, siempre que permita metadatos y reproducción web.',
  },
  {
    q: '¿Quién administra los contenidos?',
    a: 'Tu equipo con el panel BBX. Capacitamos a locutores y ventas en una sesión incluida.',
  },
  {
    q: '¿Hay demo antes de contratar?',
    a: 'Sí. Configuramos una versión con tu logo y stream en 24 horas sin compromiso.',
  },
] as const
