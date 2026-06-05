import {
  BBX_SUBSCRIPTION_PLANS,
  annualSavingsClp,
  annualTotalClp,
  formatClp,
  type BbxSubscriptionPlanId,
} from '@/lib/bbxSubscriptionPlans'

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
    'PWA instalable, reproductor en vivo, monetización digital y panel de control. Tu marca y tu audiencia — sin depender de una app genérica.',
  proof: 'Caso en producción: Radio Bienvenida 93.3 FM · Rancagua',
}

export const BBX_STATS = [
  { value: '48h', label: 'Implementación típica', accent: '#db8918' },
  { value: 'PWA', label: 'iOS y Android sin tienda', accent: '#40B9BF' },
  { value: '24/7', label: 'Stream + oyentes en vivo', accent: '#7D59B5' },
  { value: '100%', label: 'Marca de tu radio', accent: '#00D9A0' },
] as const

export type BbxHubSectionId = 'producto' | 'proceso' | 'negocio' | 'planes' | 'faq'

/** Botones hub — abren panel con el detalle (menos scroll en la landing). */
export const BBX_HUB_SECTIONS: {
  id: BbxHubSectionId
  value: string
  label: string
  subtitle: string
  accent: string
}[] = [
  {
    id: 'producto',
    value: '6+',
    label: 'Módulos',
    subtitle: 'Player, saludos, TV y monetización',
    accent: '#db8918',
  },
  {
    id: 'negocio',
    value: '+360K',
    label: 'Ingresos extra',
    subtitle: 'Ejemplo referencial de ingresos Capa 2',
    accent: '#00D9A0',
  },
  {
    id: 'planes',
    value: '3',
    label: 'Planes',
    subtitle: 'Esencial, Pro y Premium',
    accent: '#7D59B5',
  },
  {
    id: 'proceso',
    value: '48h',
    label: 'Implementación',
    subtitle: 'Diagnóstico, diseño y lanzamiento',
    accent: '#40B9BF',
  },
  {
    id: 'faq',
    value: 'FAQ',
    label: 'Preguntas',
    subtitle: 'Contratos, soporte y tiempos',
    accent: '#db8918',
  },
]

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
    desc: 'Banners rotativos, patrocinadores y reporte de impresiones/clics para vender espacios con datos reales de la app.',
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
  { step: '02', title: 'Diseño & setup', desc: 'Colores, logo, grilla y módulos activos — habitual 48–72 h con materiales listos.' },
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
  totalLabel: '$360.000',
  totalNote: 'Ejemplo referencial · no es garantía de ingresos. No incluye pauta FM ni paquetes Anunciate integrados.',
  roiNote:
    'Plan Pro cuesta $120.000/mes. Con 3 posiciones vendidas a $50.000 ($150.000) ya cubrís la plataforma; la cuarta posición es margen puro.',
  lines: [
    {
      id: 'banners',
      title: 'Banners digitales',
      amountLabel: '$200.000',
      color: '#db8918',
      hook: '4 espacios en la app — vendes por posición, no por pantalla infinita.',
      ownerBenefit:
        'La app tiene hasta 4 posiciones (superior, intermedio, inferior y En Vivo). Cada una se vende aparte: exclusiva ~$50.000/mes o compartida ~$30.000/mes (2 marcas rotando). No son 8 productos distintos: son 4 slots que llenas bien.',
      breakdown: [
        { label: 'Posiciones en app (máx.)', value: '4' },
        { label: 'Precio posición exclusiva', value: '$50.000/mes' },
        { label: 'Precio posición compartida', value: '$30.000/mes c/u' },
        { label: 'Ejemplo: 4 slots exclusivos', value: '$200.000/mes' },
      ],
      howToSell:
        'Muestra la app: “Aquí arriba, aquí en En Vivo, aquí abajo”. Un comercio compra UNA posición. Si el slot está lleno, ofrece rotación más barata o lista de espera — no vendas 8 banners como si fueran 8 pantallas.',
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
  ] satisfies BbxRevenueLine[],
}

export type BbxPricingLayer = {
  id: string
  title: string
  flow: string
  accent: string
  examples: RevenueBreakdownLine[]
  note: string
}

export const BBX_PRICING_LAYERS = {
  title: 'Dos precios, dos conversaciones',
  intro:
    'No confundas lo que la radio paga a BBX con lo que la radio cobra a un comercio del barrio. Son capas distintas del mismo ecosistema.',
  layers: [
    {
      id: 'bbx-radio',
      title: 'Capa 1 · Plataforma BBX',
      flow: 'Tu radio → paga a BBX',
      accent: '#db8918',
      examples: [
        { label: 'Plan Esencial', value: '$80.000/mes + setup' },
        { label: 'Plan Pro', value: '$120.000/mes + setup' },
        { label: 'Plan Premium', value: '$160.000/mes + setup' },
      ],
      note: 'Costo SaaS: app, panel, módulos y soporte. No incluye venderle nada a un anunciante — eso lo lo haces tú.',
    },
    {
      id: 'radio-anunciante',
      title: 'Capa 2 · Venta a comercios locales',
      flow: 'Comercio / marca → paga a tu radio',
      accent: '#40B9BF',
      examples: [
        { label: '1 posición banner (exclusiva)', value: '$30.000–$50.000/mes' },
        { label: 'Máximo simultáneo en app', value: '4 slots' },
        { label: 'Paquete FM + app integrado', value: '$80.000–$250.000/mes' },
      ],
      note: 'El slot de app es un producto chico (solo digital). El paquete integrado suma spots en FM + banner — precio mayor, como en la demo Anunciate de Bienvenida. No son lo mismo.',
    },
  ] satisfies BbxPricingLayer[],
  footnote:
    'Los $360.000 del ejemplo son ingresos referenciales por vender Capa 2 (banners + sorteos), después de pagar Capa 1. Varía según tu mercado.',
} as const

export type BbxPlanId = BbxSubscriptionPlanId

function bbxPlanPricing(id: BbxPlanId) {
  const s = BBX_SUBSCRIPTION_PLANS.find(p => p.id === id)!
  return {
    precio: formatClp(s.monthlyClp),
    setup: formatClp(s.setupClp),
    precioAnual: formatClp(annualTotalClp(s)),
    ahorroAnual: `2 meses gratis · ahorras $${formatClp(annualSavingsClp(s))}`,
  }
}

export type BbxMockupKind =
  | 'pwa'
  | 'player'
  | 'saludos'
  | 'banners'
  | 'sorteos'
  | 'analytics'
  | 'dominio'
  | 'playstore'
  | 'marca'

export type BbxPlanImage = {
  id: BbxMockupKind
  caption: string
  visualNote: string
  callouts: string[]
}

export type BbxPlan = {
  id: BbxPlanId
  nombre: string
  precio: string
  precioAnual: string
  ahorroAnual: string
  setup: string
  color: string
  popular?: boolean
  tagline: string
  features: string[]
  ideal: string
  detalle: string
  imagenes: BbxPlanImage[]
}

export const BBX_PLANS: BbxPlan[] = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    ...bbxPlanPricing('esencial'),
    color: '#40B9BF',
    tagline: 'App propia en días, sin complejidad.',
    ideal: 'Radios que quieren presencia digital profesional ya.',
    detalle: 'Tu emisora con PWA instalable, reproductor al ritmo de la música y módulos de engagement básicos. Ideal para arrancar sin panel comercial.',
    features: [
      'PWA instalable · Android e iOS',
      'Reproductor en vivo con visualizador',
      'Programación con bloque EN VIVO',
      'Saludos al aire',
      'Señal de TV integrada',
    ],
    imagenes: [
      {
        id: 'pwa',
        caption: 'Instalar en celular',
        callouts: ['Sin tienda', 'Icono en home', 'iOS + Android'],
        visualNote:
          'El oyente entra a tu URL, toca “Añadir a inicio” y queda un icono como app nativa. No pasas por App Store ni Play Store — listo en minutos tras el setup.',
      },
      {
        id: 'player',
        caption: 'Pantalla En Vivo',
        callouts: ['Visualizador al ritmo', 'Metadatos', 'Play / pause'],
        visualNote:
          'Pantalla principal de la PWA: stream en vivo, carátula del tema, visualizador que reacciona al audio y controles grandes. Es lo primero que ve quien abre tu radio.',
      },
      {
        id: 'saludos',
        caption: 'Módulo saludos',
        callouts: ['Formulario oyente', 'Llega a cabina', 'Tiempo real'],
        visualNote:
          'Desde el menú Participa el oyente escribe un saludo; en cabina aparece al instante para que el locutor lo lea en vivo. Fideliza sin WhatsApp caótico.',
      },
    ],
  },
  {
    id: 'pro',
    nombre: 'Pro',
    ...bbxPlanPricing('pro'),
    color: '#db8918',
    popular: true,
    tagline: 'Monetiza con banners, sorteos y datos.',
    ideal: 'La opción que ofreces hoy a tus radios (PWA + panel comercial).',
    detalle:
      'Producto listo para vender: PWA instalable, banners medibles, sorteos con leads, reporte mensual y panel admin. Sin Play Store ni dominio propio — eso es upgrade Premium.',
    features: [
      'Todo Esencial',
      'Banners (4 posiciones: superior, intermedio, inferior, En Vivo)',
      'Sorteos con captura de leads',
      'Votación y pedidos de tema',
      'Oyentes en vivo y reporte de sesiones',
      'Panel admin + CMS',
    ],
    imagenes: [
      {
        id: 'banners',
        caption: 'Venta de banners',
        callouts: ['Hasta 4 slots', 'Impresiones', 'Rotación'],
        visualNote:
          'Cuatro slots reales en la app (coinciden con el panel de publicidad). Vendes cada posición por separado; dentro de un slot pueden rotar 2 marcas si es plan compartido.',
      },
      {
        id: 'sorteos',
        caption: 'Sorteo patrocinado',
        callouts: ['Captura WhatsApp', 'Marca auspicia', 'Leads exportables'],
        visualNote:
          'La marca paga el sorteo; el oyente deja contacto en la app. Entregas registros al auspiciador y facturas el espacio digital + activación en vivo.',
      },
      {
        id: 'analytics',
        caption: 'Panel oyentes',
        callouts: ['En vivo ahora', 'Histórico', 'Para ventas'],
        visualNote:
          'Dashboard con oyentes conectados y sesiones registradas en la app. Ventas lo usa en reuniones con datos reales del panel — no es una suite analytics externa.',
      },
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    ...bbxPlanPricing('premium'),
    color: '#7D59B5',
    tagline: 'Upgrade: dominio, APK y Play Store.',
    ideal: 'Cuando el cliente ya tiene Pro y quiere app en la tienda.',
    detalle:
      'Parte desde Pro. Incluye entrega coordinada de APK firmado, dominio propio y publicación en Play Store por el equipo BBX (no es automático desde el panel). Módulo lanzamientos y soporte prioritario según contrato.',
    features: [
      'Todo Pro (PWA + monetización + admin)',
      'APK para Play Store (build y publicación coordinada)',
      'Dominio propio (DNS + SSL, configuración coordinada)',
      'Módulo lanzamientos musicales',
      'Soporte prioritario',
    ],
    imagenes: [
      {
        id: 'dominio',
        caption: 'Dominio propio',
        callouts: ['radio.tumarca.cl', 'SSL incluido', 'Marca 100%'],
        visualNote:
          'La app vive en tu dominio, no en un subdominio genérico. El oyente ve tu marca en la barra del navegador y comparte links con tu nombre.',
      },
      {
        id: 'playstore',
        caption: 'Google Play',
        callouts: ['APK publicada', 'Tu icono', 'Instalar clásico'],
        visualNote:
          'Generamos y publicamos el APK con tu logo y nombre en Play Store. Para oyentes que prefieren buscar “Tu Radio” en la tienda en lugar de PWA.',
      },
      {
        id: 'marca',
        caption: 'White-label',
        callouts: ['Colores', 'Logo', 'Marca de la radio'],
        visualNote:
          'Paleta, tipografía e iconografía de tu emisora. La app se ve como producto de tu radio; en despliegues Premium se ocultan referencias BBX al oyente final.',
      },
    ],
  },
]

export const BBX_PLAN_COMPARE = [
  { label: 'App PWA instalable', esencial: true, pro: true, premium: true },
  { label: 'Reproductor + visualizador', esencial: true, pro: true, premium: true },
  { label: 'Saludos al aire', esencial: true, pro: true, premium: true },
  { label: 'Banners publicitarios', esencial: false, pro: true, premium: true },
  { label: 'Sorteos + leads', esencial: false, pro: true, premium: true },
  { label: 'Oyentes en vivo + reportes', esencial: false, pro: true, premium: true },
  { label: 'Dominio propio', esencial: false, pro: false, premium: true },
  { label: 'APK Play Store', esencial: false, pro: false, premium: true },
] as const

export const BBX_FAQ = [
  {
    q: '¿Es lo mismo el precio BBX y lo que cobro por un banner?',
    a: 'No. BBX (Capa 1) es lo que tu radio paga por la plataforma — desde $80.000/mes según plan. Lo que cobras a un comercio por un slot en la app (Capa 2) lo defines tú: referencia $30.000–$50.000/mes por posición. Un paquete FM + app al anunciante final ($80.000–$250.000) es otro producto, no un banner suelto.',
  },
  {
    q: '¿Necesito publicar en App Store o Google Play?',
    a: 'No con Pro: la PWA se instala desde el navegador y ya incluye monetización. Si el cliente quiere APK en Play Store y dominio propio, vendes el upgrade Premium y el equipo BBX coordina build, dominio y publicación (entrega manual, no automática en panel).',
  },
  {
    q: '¿Puedo vender Pro y después pasar a Premium?',
    a: 'Sí. Pro es el producto base. Premium es el mismo sistema más dominio, lanzamientos y APK en tienda — sin rehacer la app desde cero.',
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
    a: 'Sí. Coordinamos una demo con tu logo y stream; el plazo habitual es 24–48 h según materiales y disponibilidad, sin compromiso de contratación.',
  },
  {
    q: '¿Puedo pagar anual en lugar de mensual?',
    a: 'Sí. Pagas 10 meses y tienes 12 meses de servicio (2 meses gratis). El setup inicial se cobra aparte, una sola vez.',
  },
] as const
