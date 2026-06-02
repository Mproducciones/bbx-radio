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

export type RevenueBreakdownLine = {
  label: string
  value: string
}

export type BbxRevenueLine = {
  id: string
  title: string
  amountLabel: string
  color: string
  hook: string
  ownerBenefit: string
  breakdown: RevenueBreakdownLine[]
  howToSell: string
}

export const BBX_REVENUE = {
  title: 'Ingresos adicionales con tu app',
  subtitle: 'Ejemplo realista para una radio regional que activa ventas digitales',
  ownerIntro:
    'La FM sigue siendo tu core. BBX agrega productos que puedes vender todos los meses: banners con impresiones, sorteos patrocinados y datos para cerrar anunciantes. Esto es lo que un dueño puede facturar extra sin duplicar equipo.',
  totalLabel: '$590.000',
  totalNote: 'Referencial · no incluye pauta tradicional al aire ni eventos especiales',
  roiNote: 'Con plan Pro ($120.000/mes), un escenario así deja margen positivo desde el primer mes con 3–4 banners vendidos.',
  lines: [
    {
      id: 'banners',
      title: 'Banners digitales',
      amountLabel: '$400.000',
      color: '#db8918',
      hook: 'Espacios en la app mientras escuchan en vivo.',
      ownerBenefit:
        'Cobrás lo mismo que un spot, pero el anunciante ve la app y vos tenés número de impresiones. Es ingreso recurrente: renueva mes a mes.',
      breakdown: [
        { label: 'Precio referencia por banner', value: '$50.000/mes' },
        { label: 'Banners vendidos (ejemplo)', value: '8' },
        { label: 'Posiciones en app', value: 'Hasta 4 rotativas' },
        { label: 'Subtotal estimado', value: '$400.000' },
      ],
      howToSell:
        'Mostrá la app en reunión: “Tu logo acá mientras suena la radio”. Ideal para comercios de barrio, clínicas y delivery.',
    },
    {
      id: 'sorteos',
      title: 'Sorteos patrocinados',
      amountLabel: '$160.000',
      color: '#40B9BF',
      hook: 'El oyente participa y deja WhatsApp; la marca paga el espacio.',
      ownerBenefit:
        'Un sorteo patrocinado vale $80.000. Dos al mes cubren parte del costo de la plataforma y llenan tu base de contactos para remarketing.',
      breakdown: [
        { label: 'Precio por sorteo patrocinado', value: '$80.000' },
        { label: 'Sorteos al mes (ejemplo)', value: '2' },
        { label: 'Leads capturados c/u', value: '50–200 contactos' },
        { label: 'Subtotal estimado', value: '$160.000' },
      ],
      howToSell:
        'Vendelo como “activación + datos”: la marca aparece en vivo, en app y se lleva los registros del concurso.',
    },
    {
      id: 'programatico',
      title: 'Monetización programática',
      amountLabel: '$30.000',
      color: '#7D59B5',
      hook: 'Ingreso pasivo complementario en la app.',
      ownerBenefit:
        'No reemplaza ventas directas, pero suma sin esfuerzo comercial. Entra solo con tráfico en la PWA.',
      breakdown: [
        { label: 'Modelo', value: 'CPM / redes display' },
        { label: 'Tráfico mensual estimado', value: '3.000–8.000 sesiones' },
        { label: 'Gestión requerida', value: 'Mínima' },
        { label: 'Subtotal estimado', value: '$30.000' },
      ],
      howToSell:
        'No se vende puerta a puerta: se activa en panel y complementa mientras escalás banners propios.',
    },
  ] satisfies BbxRevenueLine[],
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
    tagline: 'Presencia digital profesional desde el día uno.',
    ideal: 'Radios que quieren app propia sin complejidad comercial.',
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
    tagline: 'Monetizá con publicidad digital y datos de oyentes.',
    ideal: 'La opción que más rentabiliza: ventas + app + panel.',
    features: [
      'Todo Esencial',
      'Banners (hasta 4 posiciones)',
      'Sorteos con captura de leads',
      'Votación y pedidos de tema',
      'Analytics en tiempo real',
      'Panel admin + CMS',
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '160.000',
    setup: '200.000',
    color: '#7D59B5',
    tagline: 'Marca propia, dominio y presencia en tiendas.',
    ideal: 'Grupos radiales y emisoras con visión de largo plazo.',
    features: [
      'Todo Pro',
      'APK para Google Play',
      'Dominio personalizado',
      'Módulo de lanzamientos',
      'Soporte prioritario',
    ],
  },
]

export const BBX_PLAN_COMPARE = [
  { label: 'App PWA instalable', esencial: true, pro: true, premium: true },
  { label: 'Reproductor + visualizador', esencial: true, pro: true, premium: true },
  { label: 'Saludos al aire', esencial: true, pro: true, premium: true },
  { label: 'Banners publicitarios', esencial: false, pro: true, premium: true },
  { label: 'Sorteos + leads', esencial: false, pro: true, premium: true },
  { label: 'Analytics oyentes', esencial: false, pro: true, premium: true },
  { label: 'Dominio propio', esencial: false, pro: false, premium: true },
  { label: 'APK Play Store', esencial: false, pro: false, premium: true },
] as const

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
