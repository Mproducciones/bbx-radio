'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

const PLANES = [
  {
    nombre: 'Esencial',
    precio: '80.000',
    setup: '100.000',
    color: '#40B9BF',
    descripcion: 'Tu radio en el celular desde el primer día.',
    incluye: [
      'App PWA para Android e iOS',
      'Reproductor en vivo + visualizador',
      'Saludos al aire desde la app',
      'TV streaming integrado',
      'Programación semanal automática',
      'Hosting y actualizaciones incluidas',
    ],
  },
  {
    nombre: 'Pro',
    precio: '120.000',
    setup: '150.000',
    color: '#db8918',
    popular: true,
    descripcion: 'Todo para crecer y monetizar con anunciantes.',
    incluye: [
      'Todo el plan Esencial',
      'Panel de publicidad con 4 posiciones de banner',
      'Votación de canciones en tiempo real',
      'Solicitudes de canciones',
      'Sorteos con registro de oyentes (leads)',
      'Analytics de oyentes en tiempo real',
      'Noticias, eventos y replay (CMS incluido)',
      'Panel admin + soporte por WhatsApp',
    ],
  },
  {
    nombre: 'Premium',
    precio: '160.000',
    setup: '200.000',
    color: '#7D59B5',
    descripcion: 'Identidad propia y presencia máxima.',
    incluye: [
      'Todo el plan Pro',
      'APK Android para Play Store',
      'Dominio personalizado (app.turadiofm.cl)',
      'Lanzamientos musicales',
      'Capacitación en persona o videollamada',
      'Soporte prioritario 7 días',
    ],
  },
]

const FEATURES = [
  { icon: '👋', label: 'Saludos al aire',    desc: 'El oyente manda su saludo y el locutor lo lee en vivo. El feature que más fideliza en radios regionales.' },
  { icon: '📺', label: 'Radio + TV',          desc: 'Radio y canal de TV en la misma app. Dos audiencias, un solo lugar.' },
  { icon: '📢', label: 'Publicidad digital',  desc: '4 posiciones de banner. Vendés espacio digital a tus mismos anunciantes de siempre.' },
  { icon: '🎁', label: 'Sorteos con leads',   desc: 'Los oyentes se inscriben y te dan su WhatsApp. Tu base de datos crece sola.' },
  { icon: '🗳️', label: 'Votación en vivo',  desc: 'El oyente decide qué suena. Engagement inmediato.' },
  { icon: '📊', label: 'Analytics reales',   desc: 'Cuántos oyentes hay ahora mismo. Dato concreto para venderle a un anunciante.' },
]

function MiniRadioPlayer() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-6"
      style={{ background: 'rgba(219,137,24,0.08)', border: '1px solid rgba(219,137,24,0.2)' }}
    >
      <div className="flex items-end gap-0.5 h-4">
        {[0.5, 1, 0.7, 1, 0.5].map((h, i) => (
          <motion.div key={i} className="w-0.5 rounded-full bg-[#db8918]"
            animate={{ scaleY: [h, 1, h * 0.4, 1, h] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            style={{ height: 16, transformOrigin: 'bottom' }}
          />
        ))}
      </div>
      <p className="text-[#db8918] text-xs font-semibold flex-1">Radio Bienvenida · En vivo</p>
      <button onClick={toggle} className="text-white/40 hover:text-white transition-colors text-xs">
        ‖ Pausar
      </button>
    </motion.div>
  )
}

export default function BbxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: '#07070E' }}>
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex justify-end mb-6">
          <button onClick={() => router.back()}
            className="text-white/40 hover:text-white transition-colors bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2 text-sm">
            ← Volver
          </button>
        </div>

        <MiniRadioPlayer />

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#db8918]/10 border border-[#db8918]/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
            <span className="text-[#db8918] text-xs font-bold tracking-widest uppercase">BBX Radio System</span>
          </div>
          <h1 className="font-display text-5xl text-white mb-4 leading-tight">
            Tu radio.<br />Tu audiencia.<br />Tu negocio.
          </h1>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Una app para tu radio. La instalan tus oyentes, se quedan, interactúan y traen anunciantes nuevos.
          </p>
        </div>

        {/* Cómo funciona — 4 pasos */}
        <div className="mb-10">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-widest text-center mb-5">Cómo funciona</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '01', title: 'Contratás', desc: 'Elegís tu plan. Setup en 48 horas.', color: '#db8918' },
              { num: '02', title: 'Configuramos', desc: 'Tu logo, colores y programación.', color: '#40B9BF' },
              { num: '03', title: 'Lanzás', desc: 'La app lista para tus oyentes.', color: '#7D59B5' },
              { num: '04', title: 'Monetizás', desc: 'Sorteos, banners, votaciones.', color: '#00D9A0' },
            ].map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4 text-center"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                <p className="font-display text-3xl mb-1" style={{ color: s.color }}>{s.num}</p>
                <p className="text-white font-bold text-sm">{s.title}</p>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-widest text-center mb-5">Qué incluye</p>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">{f.icon}</span>
                <p className="text-white text-xs font-bold mt-2 leading-tight">{f.label}</p>
                <p className="text-white/35 text-[11px] mt-1 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Potencial de ingresos — simple */}
        <div className="mb-10 rounded-2xl p-5"
          style={{ background: 'rgba(0,217,160,0.05)', border: '1px solid rgba(0,217,160,0.2)' }}>
          <p className="text-[#00D9A0] text-[10px] font-black uppercase tracking-widest mb-1">Para el dueño de la radio</p>
          <h2 className="font-display text-2xl text-white mb-4">¿Cuánto podés ganar extra?</h2>
          <div className="space-y-3">
            {[
              { item: '8 banners digitales vendidos', valor: '+ $400.000', color: '#db8918' },
              { item: '2 sorteos patrocinados / mes',  valor: '+ $160.000', color: '#40B9BF' },
              { item: 'Google Ads automático',          valor: '+ $30.000',  color: '#7D59B5' },
            ].map(r => (
              <div key={r.item} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <p className="text-white/60 text-sm">{r.item}</p>
                </div>
                <p className="font-display text-xl flex-shrink-0" style={{ color: r.color }}>{r.valor}</p>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-1"
              style={{ borderTop: '1px solid rgba(0,217,160,0.2)' }}>
              <p className="text-white font-bold text-sm">Extra potencial / mes</p>
              <p className="font-display text-3xl text-[#00D9A0]">+ $590.000</p>
            </div>
          </div>
          <p className="text-white/25 text-[11px] mt-3">Solo de la app. Sin contar los spots de aire tradicionales.</p>
        </div>

        {/* Planes */}
        <p className="text-white/25 text-xs font-semibold uppercase tracking-widest text-center mb-5">Planes y precios</p>
        <div className="flex flex-col gap-4 mb-8">
          {PLANES.map((plan, i) => (
            <motion.div key={plan.nombre} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: plan.popular ? `${plan.color}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${plan.color}${plan.popular ? '40' : '18'}`,
              }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }} />
              {plan.popular && (
                <div className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl"
                  style={{ background: plan.color, color: '#07070E' }}>Más elegido</div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-display text-xl" style={{ color: plan.color }}>{plan.nombre}</p>
                  <p className="text-white/40 text-xs mt-0.5 max-w-[200px]">{plan.descripcion}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-white font-bold text-2xl leading-none">${plan.precio}</p>
                  <p className="text-white/30 text-xs">/mes</p>
                  <p className="text-white/20 text-xs mt-0.5">Setup ${plan.setup}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                {plan.incluye.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="flex-shrink-0 font-bold mt-0.5 text-sm" style={{ color: plan.color }}>✓</span>
                    <p className="text-white/60 text-xs">{f}</p>
                  </div>
                ))}
              </div>

              <a href={`https://wa.me/56922105555?text=${encodeURIComponent(`Hola, me interesa el plan ${plan.nombre} de BBX Radio System`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
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

        {/* CTA */}
        <div className="rounded-2xl p-5 text-center mb-6"
          style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.25)' }}>
          <p className="text-white font-bold text-base mb-1">¿Tu radio está lista para crecer?</p>
          <p className="text-white/40 text-sm mb-4">Demo configurado con tu radio en menos de 24 horas. Sin compromiso.</p>
          <a href="https://wa.me/56922105555" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#128C7E] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#0e7a6d] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Hablar con Bryan
          </a>
        </div>

        <div className="text-center text-white/15 text-xs pb-4">BBX Radio System · Chile</div>
      </div>
    </div>
  )
}
