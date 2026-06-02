'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BBX_CONTACT,
  BBX_FAQ,
  BBX_FEATURES,
  BBX_HERO,
  BBX_PLANS,
  BBX_PROCESS,
  BBX_REVENUE,
  BBX_STATS,
  bbxWhatsApp,
  type BbxPlan,
} from '@/lib/bbxContent'
import { BbxPhoneMockup } from './BbxPhoneMockup'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

function BbxIcon({ id, color }: { id: string; color: string }) {
  const stroke = color
  const icons: Record<string, ReactNode> = {
    player: (
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill={stroke} />
    ),
    saludos: (
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill={stroke} />
    ),
    ads: (
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 2v1h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5V5h16v12z" fill={stroke} />
    ),
    tv: (
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-10 8l5-3v6l-5-3z" fill={stroke} />
    ),
    polls: (
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h2v2h-2V5zm0 4h2v6h-2V9z" fill={stroke} />
    ),
    admin: (
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill={stroke} />
    ),
  }
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
      {icons[id] ?? icons.player}
    </svg>
  )
}

function PlanCard({ plan, onDetail }: { plan: BbxPlan; onDetail: () => void }) {
  return (
    <article
      className="relative rounded-2xl p-5 flex flex-col h-full"
      style={{
        background: plan.popular
          ? `linear-gradient(165deg, ${plan.color}12 0%, rgba(12,12,20,0.95) 45%)`
          : 'rgba(12,12,20,0.9)',
        border: `1px solid ${plan.color}${plan.popular ? '55' : '28'}`,
        boxShadow: plan.popular ? `0 20px 50px ${plan.color}15` : undefined,
      }}
    >
      {plan.popular && (
        <span
          className="absolute -top-px right-4 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg"
          style={{ background: plan.color, color: '#07070e' }}
        >
          Más contratado
        </span>
      )}
      <p className="font-display text-3xl leading-none" style={{ color: plan.color }}>
        {plan.nombre}
      </p>
      <p className="text-white/50 text-sm mt-2 leading-snug">{plan.tagline}</p>
      <div className="mt-4 mb-4">
        <span className="text-white text-3xl font-bold">${plan.precio}</span>
        <span className="text-white/40 text-sm"> /mes</span>
        <p className="text-white/30 text-xs mt-1">Setup único ${plan.setup}</p>
      </div>
      <ul className="space-y-2 flex-1 mb-5">
        {plan.features.slice(0, 4).map(f => (
          <li key={f} className="flex gap-2 text-sm text-white/70">
            <span style={{ color: plan.color }}>✓</span>
            {f}
          </li>
        ))}
        {plan.features.length > 4 && (
          <li className="text-white/35 text-xs">+{plan.features.length - 4} módulos más</li>
        )}
      </ul>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onDetail}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ color: plan.color, border: `1px solid ${plan.color}40`, background: `${plan.color}10` }}
        >
          Ver plan completo
        </button>
        <a
          href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, me interesa el plan ${plan.nombre} de BBX Radio System.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl text-sm font-bold text-center"
          style={{
            background: plan.popular ? plan.color : `${plan.color}18`,
            color: plan.popular ? '#07070e' : plan.color,
          }}
        >
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  )
}

function PlanModal({ plan, onClose }: { plan: BbxPlan; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal
        className="fixed z-[81] left-0 right-0 bottom-0 mx-auto max-w-lg max-h-[88dvh] overflow-y-auto rounded-t-3xl p-6"
        style={{ background: '#0c0c14', border: `1px solid ${plan.color}40` }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
        <p className="font-display text-4xl leading-none" style={{ color: plan.color }}>
          Plan {plan.nombre}
        </p>
        <p className="text-white/60 text-sm mt-2">{plan.ideal}</p>
        <p className="text-white mt-4 text-2xl font-bold">
          ${plan.precio}
          <span className="text-white/40 text-base font-normal">/mes</span>
        </p>
        <p className="text-white/35 text-sm">Setup ${plan.setup}</p>
        <ul className="mt-6 space-y-3">
          {plan.features.map(f => (
            <li key={f} className="flex gap-3 text-white/80 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${plan.color}25`, color: plan.color }}>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
        <a
          href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, quiero el plan ${plan.nombre} de BBX.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex justify-center w-full py-3.5 rounded-xl font-bold text-[#07070e]"
          style={{ background: plan.color }}
        >
          Solicitar plan {plan.nombre}
        </a>
        <button type="button" onClick={onClose} className="w-full mt-3 py-2 text-white/45 text-sm">
          Cerrar
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

function LiveDemoBar() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 rounded-full text-xs"
      style={{ background: 'rgba(219,137,24,0.12)', border: '1px solid rgba(219,137,24,0.25)' }}
    >
      <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold flex-1">Demo en vivo · Radio Bienvenida</span>
      <button type="button" onClick={toggle} className="text-white/50 hover:text-white">
        Pausar
      </button>
    </motion.div>
  )
}

export function BbxLanding() {
  const router = useRouter()
  const [planOpen, setPlanOpen] = useState<BbxPlan | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#07070e' }}>
      {/* Fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] rounded-full opacity-40 blur-[100px]" style={{ background: 'radial-gradient(circle, #db8918 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[45%] rounded-full opacity-30 blur-[90px]" style={{ background: 'radial-gradient(circle, #40B9BF 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: 'rgba(7,7,14,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wider text-white">BBX</span>
            <span className="hidden sm:inline text-[10px] text-white/35 uppercase tracking-[0.2em]">Radio System</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <a href="#producto" className="hover:text-white transition-colors">Producto</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-white/40 hover:text-white text-sm px-3 py-1.5 hidden sm:block"
            >
              Ver demo
            </button>
            <a
              href={bbxWhatsApp('Hola, quiero agendar una demo de BBX Radio System.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold px-4 py-2 rounded-full"
              style={{ background: '#db8918', color: '#07070e' }}
            >
              Agendar demo
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-[1]">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="flex justify-center mb-6">
            <LiveDemoBar />
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-[#40B9BF] text-xs font-bold uppercase tracking-[0.25em] mb-4">
                {BBX_HERO.eyebrow}
              </p>
              <h1 className="font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.95] text-white mb-5">
                {BBX_HERO.title}
              </h1>
              <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-lg mb-6">
                {BBX_HERO.subtitle}
              </p>
              <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A0]" />
                {BBX_HERO.proof}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={bbxWhatsApp('Hola Bryan, quiero ver un demo de BBX para mi radio.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#07070e]"
                  style={{ background: 'linear-gradient(135deg, #db8918, #f2c16a)' }}
                >
                  Demo gratis en 24h
                </a>
                <a
                  href="#planes"
                  className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl font-semibold text-white/80 border border-white/15 hover:border-white/30 transition-colors"
                >
                  Ver planes
                </a>
              </div>
            </div>
            <BbxPhoneMockup />
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BBX_STATS.map(s => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.accent}25` }}
              >
                <p className="font-display text-3xl md:text-4xl leading-none" style={{ color: s.accent }}>
                  {s.value}
                </p>
                <p className="text-white/45 text-xs mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Producto */}
        <section id="producto" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[#db8918] text-xs font-bold uppercase tracking-[0.2em] mb-3">Plataforma completa</p>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-none mb-4">
              Todo lo que una radio moderna necesita
            </h2>
            <p className="text-white/45 text-sm md:text-base">
              No es un sitio web reciclado: es un producto diseñado para operación diaria, ventas y oyentes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BBX_FEATURES.map((f, i) => (
              <motion.article
                key={f.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-5 group hover:border-white/15 transition-colors"
                style={{ background: 'rgba(12,12,20,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.accent}18` }}
                >
                  <BbxIcon id={f.id} color={f.accent} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Proceso */}
        <section className="max-w-6xl mx-auto px-4 py-16 border-y border-white/5">
          <h2 className="font-display text-3xl md:text-4xl text-center text-white mb-10">Cómo trabajamos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BBX_PROCESS.map((p, i) => (
              <div key={p.step} className="relative rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {i < BBX_PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent -translate-x-2" />
                )}
                <p className="font-mono text-[#db8918] text-sm font-bold mb-2">{p.step}</p>
                <h3 className="text-white font-bold mb-1">{p.title}</h3>
                <p className="text-white/40 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div
            className="rounded-3xl p-6 md:p-10 overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, rgba(0,217,160,0.08) 0%, rgba(12,12,20,0.95) 50%)', border: '1px solid rgba(0,217,160,0.2)' }}
          >
            <div className="relative z-[1] max-w-xl">
              <p className="text-[#00D9A0] text-xs font-black uppercase tracking-widest mb-2">Para dueños y gerentes</p>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-2">{BBX_REVENUE.title}</h2>
              <p className="text-white/45 text-sm mb-6">{BBX_REVENUE.subtitle}</p>
              <div className="space-y-3">
                {BBX_REVENUE.rows.map(r => (
                  <div key={r.item} className="flex justify-between items-center gap-4 text-sm">
                    <span className="text-white/60">{r.item}</span>
                    <span className="font-display text-xl shrink-0" style={{ color: r.color }}>
                      +{r.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-end mt-6 pt-6 border-t border-[#00D9A0]/20">
                <span className="text-white font-semibold">Potencial extra / mes</span>
                <span className="font-display text-4xl text-[#00D9A0]">+{BBX_REVENUE.total}</span>
              </div>
              <p className="text-white/25 text-xs mt-3">{BBX_REVENUE.note}</p>
            </div>
          </div>
        </section>

        {/* Planes */}
        <section id="planes" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl text-white mb-3">Planes transparentes</h2>
            <p className="text-white/45 text-sm">Setup único + mensualidad. Sin letra chica.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {BBX_PLANS.map(plan => (
              <PlanCard key={plan.id} plan={plan} onDetail={() => setPlanOpen(plan)} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-2xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl text-center text-white mb-8">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {BBX_FAQ.map((item, i) => (
              <div
                key={item.q}
                className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-white"
                >
                  {item.q}
                  <span className="text-white/30 text-lg shrink-0">{faqOpen === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-white/50 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #1a1028 0%, #07070e 60%)', border: '1px solid rgba(219,137,24,0.25)' }}
          >
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, #db8918 0%, transparent 50%)' }} />
            <div className="relative z-[1]">
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                ¿Listo para digitalizar tu radio?
              </h2>
              <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8">
                Habla con {BBX_CONTACT.name}. Demo personalizada en 24 horas, implementación en 48.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio con BBX.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl font-bold"
                  style={{ background: '#128C7E', color: '#fff' }}
                >
                  WhatsApp directo
                </a>
                <a
                  href={`mailto:${BBX_CONTACT.email}?subject=Demo%20BBX%20Radio%20System`}
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-semibold border border-white/20 text-white/80 hover:bg-white/5"
                >
                  {BBX_CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="font-display text-xl text-white/80 tracking-wider">BBX RADIO SYSTEM</p>
        <p className="text-white/25 text-xs mt-2">Chile · Plataforma white-label para emisoras</p>
        <button type="button" onClick={() => router.back()} className="mt-4 text-white/35 text-sm hover:text-white">
          ← Volver a la radio
        </button>
      </footer>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden border-t border-white/10 backdrop-blur-lg"
        style={{ background: 'rgba(7,7,14,0.92)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <a
          href={bbxWhatsApp('Hola, quiero una demo de BBX.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center w-full py-3.5 rounded-xl font-bold text-[#07070e]"
          style={{ background: '#db8918' }}
        >
          Agendar demo gratis
        </a>
      </div>

      {planOpen && <PlanModal plan={planOpen} onClose={() => setPlanOpen(null)} />}
    </div>
  )
}
