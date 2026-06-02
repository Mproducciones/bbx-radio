'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlan, type SponsorPlanId } from '@/lib/sponsorPlans'
import {
  SPONSOR_CHANNELS,
  SPONSOR_FAQ,
  SPONSOR_HERO,
  SPONSOR_STATS,
  SPONSOR_STEPS,
  sponsorWaLink,
} from '@/lib/sponsorContent'
import { PlanDetailSheet } from './PlanDetailSheet'

function ChannelIcon({ id, color }: { id: string; color: string }) {
  const icons: Record<string, ReactNode> = {
    radio: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill={color} />,
    app: <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM12 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill={color} />,
    region: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={color} />,
  }
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
      {icons[id] ?? icons.radio}
    </svg>
  )
}

function PlanCard({ plan, onOpen }: { plan: SponsorPlan; onOpen: () => void }) {
  return (
    <article
      className="relative rounded-2xl p-5 flex flex-col h-full text-left w-full transition-transform active:scale-[0.99]"
      style={{
        background: plan.popular
          ? `linear-gradient(165deg, ${plan.color}14 0%, rgba(12,12,20,0.96) 50%)`
          : 'rgba(12,12,20,0.92)',
        border: `1px solid ${plan.color}${plan.popular ? '55' : '28'}`,
        boxShadow: plan.popular ? `0 16px 48px ${plan.color}18` : undefined,
      }}
    >
      {plan.popular && (
        <span
          className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-2xl"
          style={{ background: plan.color, color: '#07070e' }}
        >
          Recomendado
        </span>
      )}
      <p className="font-display text-3xl leading-none text-white">{plan.nombre}</p>
      <p className="text-white/50 text-sm mt-2 leading-snug">{plan.tagline}</p>
      <div className="mt-4 mb-4">
        <span className="text-white text-3xl font-bold">${plan.precio}</span>
        <span className="text-white/40 text-sm"> /mes CLP</span>
      </div>
      <ul className="space-y-2 flex-1 mb-5">
        {plan.features.map(f => (
          <li key={f} className="flex gap-2 text-sm text-white/75">
            <span className="font-bold shrink-0" style={{ color: plan.color }}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onOpen}
        className="w-full py-3 rounded-xl text-sm font-bold"
        style={{
          background: plan.popular ? plan.color : `${plan.color}18`,
          color: plan.popular ? '#07070e' : plan.color,
          border: plan.popular ? 'none' : `1px solid ${plan.color}40`,
        }}
      >
        Ver ejemplos y detalle
      </button>
    </article>
  )
}

export function SponsorLanding() {
  const [listeners, setListeners] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null

  useEffect(() => {
    fetch('/api/listeners/count')
      .then(r => r.json())
      .then(d => setListeners(d.count))
      .catch(() => {})
  }, [])

  return (
    <div className="relative pb-24 md:pb-8">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-48 opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(219,137,24,0.25) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-1/2 h-40 opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(64,185,191,0.2) 0%, transparent 70%)' }}
        />
      </div>

      {/* Hero */}
      <header className="rounded-3xl overflow-hidden mb-8 relative"
        style={{
          background: 'linear-gradient(165deg, #1a1028 0%, #0c0c14 45%, #07070e 100%)',
          border: '1px solid rgba(219,137,24,0.22)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #db8918, #40B9BF, transparent)' }} />
        <div className="px-5 pt-8 pb-7 md:px-8 md:py-10">
          <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.28em] mb-3 text-center md:text-left">
            {SPONSOR_HERO.eyebrow}
          </p>
          <div className="md:flex md:items-end md:justify-between md:gap-8">
            <div className="text-center md:text-left">
              <h1 className="font-display text-[clamp(2rem,7vw,3.25rem)] text-white leading-[0.95] tracking-wide mb-3">
                {SPONSOR_HERO.title}
              </h1>
              <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
                {SPONSOR_HERO.subtitle}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/70 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="font-display text-[#db8918] text-base">{RADIO.frequency}</span>
                <span className="text-white/30">·</span>
                {RADIO.name} · {RADIO.city}
              </p>
            </div>
            <a
              href={sponsorWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex shrink-0 items-center justify-center px-6 py-3.5 rounded-xl font-bold text-[#07070e] mt-0"
              style={{ background: 'linear-gradient(135deg, #db8918, #f2c16a)' }}
            >
              Cotizar campaña
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8">
            {SPONSOR_STATS.map(s => {
              const isLive = 'live' in s && s.live
              const value = isLive && listeners != null ? String(listeners) : s.value
              return (
                <div
                  key={s.label}
                  className="rounded-xl py-3 px-2 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.accent}22` }}
                >
                  <p className="font-display text-2xl md:text-3xl leading-none" style={{ color: s.accent }}>
                    {value}
                    {isLive && listeners != null && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D9A0] ml-1 align-middle animate-pulse" />
                    )}
                  </p>
                  <p className="text-white/45 text-[10px] md:text-xs mt-1 font-semibold uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Canales */}
      <section className="mb-10">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl text-white leading-none">Dónde te verán</h2>
          <p className="text-white/40 text-sm mt-2">Radio tradicional + presencia digital en la misma campaña</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {SPONSOR_CHANNELS.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(12,12,20,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${ch.accent}18` }}
              >
                <ChannelIcon id={ch.id} color={ch.accent} />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{ch.title}</h3>
              <p className="text-white/45 text-xs leading-relaxed">{ch.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="mb-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-white leading-none">Planes de publicidad</h2>
            <p className="text-white/40 text-xs mt-2">Precios mensuales · cotización sin compromiso</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {SPONSOR_PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} onOpen={() => setSelectedId(plan.id)} />
          ))}
        </div>
      </section>

      {/* Proceso */}
      <section className="mb-10 rounded-2xl p-5 md:p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="font-display text-xl text-white mb-5 text-center">Cómo empezar</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {SPONSOR_STEPS.map(s => (
            <div key={s.step}>
              <p className="font-mono text-[#db8918] text-xs font-bold mb-1">{s.step}</p>
              <p className="text-white font-bold text-sm">{s.title}</p>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="font-display text-xl text-white mb-4 text-center">Preguntas frecuentes</h2>
        <div className="space-y-2 max-w-2xl mx-auto">
          {SPONSOR_FAQ.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(12,12,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-white"
              >
                {item.q}
                <span className="text-white/30 shrink-0">{faqOpen === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3.5 text-white/50 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA desktop */}
      <section
        className="hidden md:block rounded-2xl p-6 text-center mb-4"
        style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.25)' }}
      >
        <p className="text-white font-bold text-lg mb-1">¿Listo para salir al aire?</p>
        <p className="text-white/45 text-sm mb-4">Ventas te responde por WhatsApp con propuesta a medida.</p>
        <a
          href={sponsorWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#128C7E] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          Hablar con ventas
        </a>
      </section>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />

      {/* Sticky CTA móvil */}
      <div
        className="fixed left-0 right-0 z-40 p-3 md:hidden border-t border-white/10 backdrop-blur-lg"
        style={{
          bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(7,7,14,0.94)',
        }}
      >
        <a
          href={sponsorWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center w-full py-3.5 rounded-xl font-bold text-white"
          style={{ background: '#128C7E' }}
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </div>
  )
}
