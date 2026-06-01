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
      'Programación semanal con "EN VIVO" automático',
      'TV streaming integrado',
      'Qué sonó hoy (historial en vivo)',
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
  { icon: '🗳️', label: 'Votación en vivo',     desc: 'El oyente decide qué suena. Crea engagement inmediato con jóvenes.' },
  { icon: '🎁', label: 'Sorteos digitales',    desc: 'Registra oyentes con nombre y WhatsApp. Tu base de datos crece sola.' },
  { icon: '📊', label: 'Analytics reales',     desc: 'Muéstrale a tus anunciantes cuántos oyentes tenés ahora mismo.' },
  { icon: '🎵', label: 'Solicitudes en cola',  desc: 'Los oyentes piden canciones y ven su posición. Nunca se pierden.' },
  { icon: '📺', label: 'TV + Radio unificados', desc: 'Radio y canal de TV en la misma app. Dos audiencias, un solo lugar.' },
  { icon: '🌐', label: 'PWA + APK nativa',    desc: 'Funciona en todos los celulares. Sin depender del App Store.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Contratás', desc: 'Elegís tu plan. Setup en menos de 48 horas.', color: '#db8918' },
  { step: '02', title: 'Activás', desc: 'Configuramos tu radio, colores, logo y programación.', color: '#40B9BF' },
  { step: '03', title: 'Lanzás', desc: 'La app está lista para que tus oyentes la descarguen.', color: '#7D59B5' },
  { step: '04', title: 'Crecés', desc: 'Activás sorteos, votaciones y empezás a capturar leads.', color: '#00D9A0' },
]

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
