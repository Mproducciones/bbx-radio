'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const PLANES = [
  {
    nombre: 'Esencial',
    precio: '80.000',
    setup: '100.000',
    color: '#40B9BF',
    descripcion: 'Tu radio en el celular. Presencia digital inmediata para empezar.',
    incluye: [
      'App PWA instalable en Android e iOS',
      'Reproductor en vivo con visualizador',
      'Saludos al aire — oyentes mandan mensajes en vivo',
      'TV streaming integrado',
      'Programación semanal con "EN VIVO" automático',
      'Hosting incluido · Actualizaciones automáticas',
    ],
    noIncluye: ['Votación de canciones', 'Sorteos y registro de oyentes', 'Solicitudes de canciones', 'Panel de analytics', 'Publicidad digital'],
  },
  {
    nombre: 'Pro',
    precio: '120.000',
    setup: '150.000',
    color: '#db8918',
    popular: true,
    descripcion: 'Todo lo que una radio profesional necesita para crecer y monetizar.',
    incluye: [
      'Todo lo del plan Esencial',
      'Votación de canciones en tiempo real',
      'Solicitudes de canciones con cola visible',
      'Registro de oyentes para sorteos',
      'Story generator para redes sociales',
      'Panel de administración con analytics',
      'Noticias, eventos y replay (CMS incluido)',
      'Sistema de publicidad con banners rotativos',
      'Soporte por WhatsApp',
    ],
    noIncluye: ['Lanzamientos musicales', 'APK nativa Android', 'Dominio personalizado'],
    extras: [
      { label: 'Sorteo activado', price: '15.000', note: 'por evento' },
      { label: 'Lead capturado', price: '500', note: 'por oyente registrado' },
    ],
  },
  {
    nombre: 'Premium',
    precio: '160.000',
    setup: '200.000',
    color: '#7D59B5',
    descripcion: 'Máxima presencia, identidad propia y herramientas exclusivas.',
    incluye: [
      'Todo lo del plan Pro',
      'Lanzamientos musicales',
      'APK Android para Play Store',
      'Dominio personalizado (app.turadiofm.cl)',
      'Soporte prioritario 7 días',
      'Capacitación en persona o videollamada',
    ],
    noIncluye: [],
  },
]

const DIFERENCIADORES = [
  { icon: '👋', label: 'Saludos al aire',       desc: 'El oyente manda su saludo desde la app y el locutor lo lee en vivo. El feature que más fideliza.' },
  { icon: '📺', label: 'TV + Radio unificados', desc: 'Radio y canal de TV en la misma app. Dos audiencias, un solo lugar.' },
  { icon: '🗳️', label: 'Votación en vivo',     desc: 'El oyente decide qué suena. Crea engagement inmediato.' },
  { icon: '🎁', label: 'Sorteos digitales',    desc: 'Registra oyentes con nombre y WhatsApp. Tu base de datos crece sola.' },
  { icon: '📊', label: 'Analytics reales',     desc: 'Muéstrale a tus anunciantes cuántos oyentes tenés ahora mismo.' },
  { icon: '🌐', label: 'PWA instalable',       desc: 'Se instala como app nativa en Android e iOS. Sin App Store, sin costos.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Contratás', desc: 'Elegís tu plan. Setup en menos de 48 horas.', color: '#db8918' },
  { step: '02', title: 'Activás', desc: 'Configuramos tu radio, colores, logo y programación.', color: '#40B9BF' },
  { step: '03', title: 'Lanzás', desc: 'La app está lista para que tus oyentes la descarguen.', color: '#7D59B5' },
  { step: '04', title: 'Crecés', desc: 'Activás sorteos, votaciones y empezás a capturar leads.', color: '#00D9A0' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Cómo ganar plata con tu radio (explicación para el dueño)
// ─────────────────────────────────────────────────────────────────────────────

const SORTEO_STEPS = [
  {
    num: '1',
    title: 'Tú activás un sorteo',
    desc: 'Desde tu panel, en 30 segundos: le ponés nombre al sorteo y qué se gana. Por ejemplo: "2 entradas al Festival de Verano".',
    color: '#db8918',
  },
  {
    num: '2',
    title: 'Tus oyentes se inscriben',
    desc: 'Desde la app, ponen su nombre y WhatsApp. Ven su número de participante. El locutor lo menciona al aire: "¡Ya van 47 inscritos!".',
    color: '#40B9BF',
  },
  {
    num: '3',
    title: 'El anunciante paga por el sorteo',
    desc: 'El supermercado, la automotora o la clínica ponen el premio y te pagan por aparecer como patrocinador. Tú guardás todos los números.',
    color: '#7D59B5',
  },
  {
    num: '4',
    title: 'Tenés una base de datos real',
    desc: '200 personas de Rancagua que escuchan tu radio y te dieron su WhatsApp. Eso vale plata para cualquier negocio local.',
    color: '#00D9A0',
  },
]

const CASOS_USO = [
  {
    negocio: 'Supermercado',
    ejemplo: 'Patrocina un sorteo de canastas navideñas',
    paga: '$80.000',
    tiObtenes: '150 leads + exposición en la app',
    icon: '🛒',
    color: '#7D59B5',
  },
  {
    negocio: 'Automotora',
    ejemplo: 'Paga por un broadcast a tu base de contactos',
    paga: '$60.000',
    tiObtenes: '300 WhatsApps con su oferta del mes',
    icon: '🚗',
    color: '#40B9BF',
  },
  {
    negocio: 'Pizzería / Restorán',
    ejemplo: 'Cupón de descuento a tu lista de oyentes',
    paga: '$40.000',
    tiObtenes: 'Clientes reales que van a comer',
    icon: '🍕',
    color: '#db8918',
  },
  {
    negocio: 'Clínica / Farmacia',
    ejemplo: 'Campaña de prevención patrocinada',
    paga: '$90.000',
    tiObtenes: 'Imagen de marca + leads para su base',
    icon: '🏥',
    color: '#FF8C42',
  },
]

const FRASE_PITCH = `"Tengo 200 personas de Rancagua que me dieron su WhatsApp voluntariamente porque escuchan mi radio. Son tus clientes. ¿Cuánto vale llegar directo al celular de 200 personas de tu ciudad?"`

function MonetizacionSection() {
  return (
    <div className="mb-12">

      {/* Título */}
      <div className="text-center mb-8">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">Para el dueño de la radio</p>
        <h2 className="font-display text-3xl text-white leading-tight mb-2">
          ¿Cómo gano más plata<br />con esto?
        </h2>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          La app no es un gasto. Es una herramienta para venderle más a tus anunciantes y conseguir anunciantes nuevos.
        </p>
      </div>

      {/* Flujo del sorteo */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-white font-bold text-sm mb-1">El ciclo que genera plata</p>
        <p className="text-white/40 text-xs mb-5">Así funciona un sorteo patrocinado, paso a paso</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SORTEO_STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-xl p-3"
              style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}
            >
              {i < SORTEO_STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-10">
                  <svg className="w-3 h-3 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              )}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-display text-lg mb-2"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                {s.num}
              </div>
              <p className="text-white font-semibold text-xs leading-snug mb-1">{s.title}</p>
              <p className="text-white/40 text-[11px] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Qué le decís al anunciante */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(219,137,24,0.06)', border: '1px solid rgba(219,137,24,0.2)' }}
      >
        <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest mb-3">Qué le decís al anunciante</p>
        <blockquote
          className="text-white text-base font-medium leading-relaxed italic mb-3"
          style={{ borderLeft: '3px solid #db8918', paddingLeft: '16px' }}
        >
          {FRASE_PITCH}
        </blockquote>
        <p className="text-white/40 text-xs">
          Ningún negocio local puede comprar eso en Facebook o Google. Vos sí lo tenés.
        </p>
      </div>

      {/* Ejemplos reales con números */}
      <div className="mb-4">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">Ejemplos con números reales</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CASOS_USO.map((c, i) => (
            <motion.div
              key={c.negocio}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}18` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${c.color}12` }}
              >
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{c.negocio}</p>
                <p className="text-white/40 text-xs mt-0.5 leading-snug">{c.ejemplo}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wide">Te paga</p>
                    <p className="font-display text-lg leading-none" style={{ color: c.color }}>{c.paga}</p>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wide">Tú obtenés</p>
                    <p className="text-white/60 text-xs leading-snug">{c.tiObtenes}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cuánto podés ganar extra */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(0,217,160,0.05)', border: '1px solid rgba(0,217,160,0.15)' }}
      >
        <p className="text-[#00D9A0] text-[10px] font-black uppercase tracking-widest mb-3">Cuánto podés ganar de más por mes</p>

        <div className="space-y-3">
          {[
            { item: '2 sorteos patrocinados / mes',        valor: '+ $160.000', color: '#db8918' },
            { item: '1 broadcast de WhatsApp / mes',        valor: '+  $50.000', color: '#40B9BF' },
            { item: 'Banner premium en app (1 anunciante)', valor: '+  $80.000', color: '#7D59B5' },
          ].map(r => (
            <div key={r.item} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                <p className="text-white/60 text-sm">{r.item}</p>
              </div>
              <p className="font-display text-xl flex-shrink-0" style={{ color: r.color }}>{r.valor}</p>
            </div>
          ))}

          <div
            className="flex items-center justify-between pt-3 mt-1"
            style={{ borderTop: '1px solid rgba(0,217,160,0.2)' }}
          >
            <p className="text-white font-bold text-sm">Ingreso extra potencial / mes</p>
            <p className="font-display text-2xl text-[#00D9A0]">+ $290.000</p>
          </div>
        </div>

        <p className="text-white/25 text-[11px] mt-3 leading-relaxed">
          Sin contar la suscripción base. Solo de los servicios adicionales que la plataforma te permite ofrecer.
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BbxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: '#07070E' }}>
      <div className="max-w-3xl mx-auto px-4 py-6">

        <div className="flex justify-end mb-6">
          <button onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2 text-sm">
            ← Volver a la app
          </button>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#db8918]/10 border border-[#db8918]/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
            <span className="text-[#db8918] text-xs font-bold tracking-widest uppercase">BBX Radio System</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-tight">
            Tu radio.<br />Tu audiencia.<br />Tu negocio.
          </h1>
          <p className="text-white/50 text-base max-w-lg mx-auto">
            La plataforma que convierte oyentes pasivos en una comunidad activa que compra, vota y participa.
          </p>
        </div>

        {/* Cómo funciona */}
        <div className="mb-12">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider text-center mb-6">Cómo funciona</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20` }}>
                <p className="font-display text-3xl mb-2" style={{ color: s.color }}>{s.step}</p>
                <p className="text-white font-bold text-sm">{s.title}</p>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Diferenciadores */}
        <div className="mb-12">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider text-center mb-4">Lo que te diferencia</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DIFERENCIADORES.map(d => (
              <div key={d.label} className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-2xl">{d.icon}</span>
                <p className="text-white text-xs font-semibold mt-2 leading-tight">{d.label}</p>
                <p className="text-white/35 text-[11px] mt-1 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo ganar plata con tu radio */}
        <MonetizacionSection />

        {/* Planes */}
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider text-center mb-5">Planes y precios</p>
        <div className="flex flex-col gap-4 mb-8">
          {PLANES.map((plan, i) => (
            <motion.div key={plan.nombre} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: plan.popular ? `${plan.color}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${plan.color}${plan.popular ? '40' : '18'}`,
              }}>
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }} />
              {plan.popular && (
                <div className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl"
                  style={{ background: plan.color, color: '#07070E' }}>Más elegido</div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-display text-xl tracking-wide" style={{ color: plan.color }}>{plan.nombre}</p>
                  <p className="text-white/40 text-xs max-w-xs mt-0.5">{plan.descripcion}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-white font-bold text-2xl leading-none">${plan.precio}</p>
                  <p className="text-white/30 text-xs">/mes</p>
                  <p className="text-white/20 text-xs mt-0.5">Setup ${plan.setup}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                {plan.incluye.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="flex-shrink-0 font-bold mt-0.5" style={{ color: plan.color }}>✓</span>
                    <p className="text-white/60 text-xs">{f}</p>
                  </div>
                ))}
                {plan.noIncluye.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="flex-shrink-0 text-white/15 mt-0.5">✗</span>
                    <p className="text-white/20 text-xs">{f}</p>
                  </div>
                ))}
              </div>

              {/* Extras (modelo per-activation) */}
              {plan.extras && (
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">+ Activaciones opcionales</p>
                  <div className="flex gap-3 flex-wrap">
                    {plan.extras.map(e => (
                      <div key={e.label} className="rounded-lg px-3 py-1.5"
                        style={{ background: `${plan.color}10`, border: `1px solid ${plan.color}25` }}>
                        <p className="text-xs font-bold" style={{ color: plan.color }}>${e.price} <span className="font-normal text-white/30">{e.note}</span></p>
                        <p className="text-white/40 text-[10px]">{e.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <a href={`https://wa.me/56922105555?text=${encodeURIComponent(`Hola, me interesa el plan ${plan.nombre} de BBX Radio System`)}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{
                  background: plan.popular ? plan.color : `${plan.color}15`,
                  color: plan.popular ? '#07070E' : plan.color,
                  border: plan.popular ? 'none' : `1px solid ${plan.color}30`,
                }}>
                Quiero el plan {plan.nombre} →
              </a>
            </motion.div>
          ))}
        </div>

        {/* Condiciones */}
        <div className="rounded-xl p-4 text-xs text-white/30 space-y-1 mb-8"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 font-semibold mb-2">Condiciones</p>
          <p>• Setup se cobra una sola vez al contratar · Primer mes por adelantado</p>
          <p>• Cancelación con 30 días de aviso · Sin multa ni letra chica</p>
          <p>• Precio en CLP · Transferencia bancaria o WebPay</p>
          <p>• Las activaciones (sorteos, leads) se facturan mensualmente según uso</p>
        </div>

        {/* CTA */}
        <div className="rounded-xl p-5 text-center mb-8"
          style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.25)' }}>
          <p className="text-white font-bold text-base mb-1">¿Tu radio está lista para crecer?</p>
          <p className="text-white/40 text-sm mb-4">Te armo un demo con tu radio configurada en menos de 24 horas. Sin compromiso.</p>
          <a href="https://wa.me/56922105555" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#128C7E] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#0e7a6d] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Hablar con Bryan
          </a>
        </div>

        <div className="text-center text-white/20 text-xs pb-4">BBX Radio System · Tu radio, tu audiencia, tu negocio · Chile</div>
      </div>
    </div>
  )
}
