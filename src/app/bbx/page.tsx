'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

// ── Mockup del celular ────────────────────────────────────────────────────────
function AppMockup() {
  return (
    <div className="relative w-[160px] mx-auto select-none">
      <div className="absolute inset-[-20px] blur-3xl opacity-30 rounded-full"
        style={{ background: 'radial-gradient(circle, #db8918 0%, #7B2FFF 60%, transparent 100%)' }} />
      <div className="relative rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background: '#05050D', border: '2.5px solid rgba(255,255,255,0.1)', aspectRatio: '9/19.5' }}>

        {/* Status bar */}
        <div className="flex justify-between px-3 pt-2 pb-1">
          <p className="text-[7px] text-white/40">9:41</p>
          <div className="flex gap-1 items-center">
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Header */}
        <div className="px-3 flex justify-between items-center mb-2">
          <div>
            <p className="text-[9px] text-white font-bold leading-none">Radio Bienvenida</p>
            <p className="text-[6px] text-white/30 mt-0.5">Tu radio · 93.3 FM</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[7px] text-red-400 font-bold">EN VIVO</p>
          </div>
        </div>

        {/* Player card */}
        <div className="mx-3 rounded-xl p-2.5 mb-2"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[7px] text-white/40">Ahora suena</p>
              <p className="text-[9px] text-white font-bold">Sabor A Mí</p>
              <p className="text-[6px] text-white/30">Los Panchos</p>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#db8918' }}>
              <div className="w-0 h-0 ml-0.5"
                style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #07070E' }} />
            </div>
          </div>
          <div className="flex items-end gap-px h-3">
            {[2,4,3,6,4,7,3,5,4,6,3,4].map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-full"
                style={{ background: '#db8918', opacity: 0.6 + (h / 14) }}
                animate={{ scaleY: [1, h / 4, 1] }}
                transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, delay: i * 0.06 }}
                initial={{ height: h * 1.5, transformOrigin: 'bottom' }}
              />
            ))}
          </div>
        </div>

        {/* Saludo */}
        <div className="mx-3 rounded-xl p-2 mb-2"
          style={{ background: 'rgba(219,137,24,0.1)', border: '1px solid rgba(219,137,24,0.25)' }}>
          <p className="text-[7px] font-black" style={{ color: '#db8918' }}>👋 SALUDO AL AIRE</p>
          <p className="text-[8px] text-white mt-0.5 leading-tight">Para Rosa, de Juan 🎂</p>
          <p className="text-[6px] text-white/30 mt-0.5">hace 2 min</p>
        </div>

        {/* Banner */}
        <div className="mx-3 rounded-xl p-2"
          style={{ background: 'rgba(64,185,191,0.08)', border: '1px solid rgba(64,185,191,0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[6px] font-black uppercase tracking-wider" style={{ color: '#40B9BF' }}>PUBLICIDAD</p>
              <p className="text-[7px] text-white font-bold mt-0.5">AutoMundo Rancagua</p>
            </div>
            <div className="text-[7px] px-1.5 py-0.5 rounded font-bold flex-shrink-0"
              style={{ background: '#40B9BF', color: '#07070E' }}>Ver →</div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around py-1.5 px-1"
          style={{ background: 'rgba(5,5,13,0.96)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { icon: '📻', label: 'En Vivo', active: true },
            { icon: '👋', label: 'Saludos' },
            { icon: '📺', label: 'TV' },
            { icon: '📢', label: 'Anunciate' },
          ].map(tab => (
            <div key={tab.label} className="flex flex-col items-center gap-0.5 relative">
              {tab.active && <div className="absolute -top-1.5 w-5 h-0.5 rounded-full" style={{ background: '#db8918' }} />}
              <span className="text-[9px]">{tab.icon}</span>
              <p className="text-[5px] font-medium" style={{ color: tab.active ? '#db8918' : 'rgba(255,255,255,0.3)' }}>{tab.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Mini player BBX ───────────────────────────────────────────────────────────
function MiniRadioPlayer() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-6"
      style={{ background: 'rgba(219,137,24,0.08)', border: '1px solid rgba(219,137,24,0.2)' }}>
      <div className="flex items-end gap-0.5 h-4">
        {[0.5, 1, 0.7, 1, 0.5].map((h, i) => (
          <motion.div key={i} className="w-0.5 rounded-full bg-[#db8918]"
            animate={{ scaleY: [h, 1, h * 0.4, 1, h] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            style={{ height: 16, transformOrigin: 'bottom' }} />
        ))}
      </div>
      <p className="text-[#db8918] text-xs font-semibold flex-1">Radio Bienvenida · En vivo</p>
      <button onClick={toggle} className="text-white/40 hover:text-white transition-colors text-xs">‖ Pausar</button>
    </motion.div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function BbxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: '#07070E' }}>
      <div className="max-w-xl mx-auto px-4 py-6">

        <div className="flex justify-end mb-4">
          <button onClick={() => router.back()}
            className="text-white/30 hover:text-white transition-colors text-sm">
            ← Volver
          </button>
        </div>

        <MiniRadioPlayer />

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#db8918]/10 border border-[#db8918]/30 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
            <span className="text-[#db8918] text-xs font-bold tracking-widest uppercase">BBX Radio System</span>
          </div>
        </div>

        {/* Hero con mockup */}
        <div className="grid grid-cols-2 gap-6 items-center mb-12">
          <div>
            <h1 className="font-display text-4xl text-white leading-tight mb-3">
              Tu radio.<br />Tu audiencia.<br />Tu negocio.
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Una app instalable para tu radio. En 48 horas tu logo, tu música, tu programación.
            </p>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <AppMockup />
          </motion.div>
        </div>

        {/* 3 números */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { num: '48h', label: 'Setup completo', color: '#db8918' },
            { num: '$0', label: 'App Store no necesario', color: '#40B9BF' },
            { num: '100%', label: 'A tu marca', color: '#7D59B5' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20` }}>
              <p className="font-display text-2xl leading-none mb-1" style={{ color: s.color }}>{s.num}</p>
              <p className="text-white/35 text-[10px] leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Lo que hace la app */}
        <div className="mb-10">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-widest text-center mb-5">Lo que hace la app</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '👋', title: 'Saludos al aire', desc: 'El oyente manda un saludo, el locutor lo lee en vivo. El feature más poderoso para fidelizar.' },
              { icon: '📺', title: 'Radio + TV', desc: 'Señal de radio y canal de TV en un solo lugar. Dos audiencias unificadas.' },
              { icon: '📢', title: 'Publicidad digital', desc: 'Vendés banners a tus mismos anunciantes. Hasta 4 posiciones simultáneas.' },
              { icon: '🎁', title: 'Sorteos con leads', desc: 'Los oyentes se inscriben y te dan su WhatsApp. Tu base de datos crece sola.' },
              { icon: '🗳️', title: 'Votaciones en vivo', desc: 'El oyente vota qué suena. Engagement real, pantallas llenas de actividad.' },
              { icon: '📊', title: 'Analytics real', desc: 'Cuántos oyentes ahora mismo. Dato concreto para mostrarle a un anunciante.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">{f.icon}</span>
                <p className="text-white text-xs font-bold mt-2 leading-tight">{f.title}</p>
                <p className="text-white/35 text-[11px] mt-1 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Potencial de ingresos */}
        <div className="mb-10 rounded-2xl p-5"
          style={{ background: 'rgba(0,217,160,0.05)', border: '1px solid rgba(0,217,160,0.2)' }}>
          <p className="text-[#00D9A0] text-[10px] font-black uppercase tracking-widest mb-1">Para el dueño</p>
          <h2 className="font-display text-2xl text-white mb-4">¿Cuánto podés ganar extra?</h2>
          <div className="space-y-2.5">
            {[
              { item: '8 banners digitales vendidos / mes', valor: '$400.000', color: '#db8918' },
              { item: '2 sorteos patrocinados / mes',       valor: '$160.000', color: '#40B9BF' },
              { item: 'Google Ads automático (sin gestión)', valor: '$30.000',  color: '#7D59B5' },
            ].map(r => (
              <div key={r.item} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <p className="text-white/55 text-sm">{r.item}</p>
                </div>
                <p className="font-display text-xl flex-shrink-0" style={{ color: r.color }}>+{r.valor}</p>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-1"
              style={{ borderTop: '1px solid rgba(0,217,160,0.2)' }}>
              <p className="text-white font-bold">Extra potencial / mes</p>
              <p className="font-display text-3xl text-[#00D9A0]">+$590.000</p>
            </div>
          </div>
          <p className="text-white/20 text-[10px] mt-3">Solo de la app. Sin contar los spots al aire.</p>
        </div>

        {/* Planes */}
        <p className="text-white/25 text-xs font-semibold uppercase tracking-widest text-center mb-5">Elige tu plan</p>
        <div className="flex flex-col gap-4 mb-8">
          {[
            {
              nombre: 'Esencial', precio: '80.000', setup: '100.000', color: '#40B9BF',
              tagline: 'Tu radio en el celular desde el primer día.',
              features: ['App PWA · Android e iOS', 'Reproductor en vivo + visualizador', 'Saludos al aire', 'TV streaming', 'Programación con "EN VIVO" automático'],
            },
            {
              nombre: 'Pro', precio: '120.000', setup: '150.000', color: '#db8918', popular: true,
              tagline: 'Monetizá tu radio con publicidad digital y sorteos.',
              features: ['Todo Esencial +', 'Sistema de publicidad (4 banners)', 'Sorteos con captura de leads', 'Votación de canciones en vivo', 'Analytics de oyentes en tiempo real', 'Panel admin + CMS completo'],
            },
            {
              nombre: 'Premium', precio: '160.000', setup: '200.000', color: '#7D59B5',
              tagline: 'Identidad propia y máxima presencia digital.',
              features: ['Todo Pro +', 'APK Android para Play Store', 'Dominio personalizado', 'Lanzamientos musicales', 'Capacitación y soporte prioritario'],
            },
          ].map((plan, i) => (
            <motion.div key={plan.nombre} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: plan.popular ? `${plan.color}08` : 'rgba(255,255,255,0.02)',
                border: `2px solid ${plan.color}${plan.popular ? '50' : '20'}`,
              }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }} />
              {plan.popular && (
                <div className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: plan.color, color: '#07070E' }}>⭐ Más elegido</div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display text-2xl leading-none" style={{ color: plan.color }}>{plan.nombre}</p>
                  <p className="text-white/40 text-xs mt-1 max-w-[180px] leading-snug">{plan.tagline}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-white font-bold text-3xl leading-none">${plan.precio}</p>
                  <p className="text-white/30 text-xs">/mes</p>
                  <p className="text-white/20 text-[10px] mt-0.5">Setup ${plan.setup}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    <p className="text-white/60 text-xs">{f}</p>
                  </div>
                ))}
              </div>

              <a href={`https://wa.me/56922105555?text=${encodeURIComponent(`Hola Bryan, me interesa el plan ${plan.nombre} de BBX Radio System. ¿Podemos hablar?`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: plan.popular ? plan.color : `${plan.color}15`,
                  color: plan.popular ? '#07070E' : plan.color,
                  border: plan.popular ? 'none' : `1px solid ${plan.color}35`,
                }}>
                Quiero el plan {plan.nombre} →
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-5 text-center mb-4"
          style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.25)' }}>
          <p className="text-white font-bold text-base mb-1">Demo gratis en 24 horas</p>
          <p className="text-white/40 text-sm mb-4">Configuramos una versión con tu radio sin compromiso.</p>
          <a href="https://wa.me/56922105555?text=Hola%20Bryan%2C%20quiero%20ver%20un%20demo%20de%20BBX%20Radio%20System%20para%20mi%20radio"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#128C7E] text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:bg-[#0e7a6d] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Hablar con Bryan ahora
          </a>
        </div>

        <p className="text-center text-white/10 text-xs pb-4">BBX Radio System · Chile · 2025</p>
      </div>
    </div>
  )
}
