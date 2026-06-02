'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlan, type SponsorPlanId } from '@/lib/sponsorPlans'
import { SPONSOR_FAQ, SPONSOR_HERO, SPONSOR_STATS, SPONSOR_STEPS, sponsorWaLink } from '@/lib/sponsorContent'
import { PlanDetailSheet } from './PlanDetailSheet'
import { SponsorValueSection } from './SponsorValueSection'
import { SponsorPlansSection } from './SponsorPlansSection'
import { PlanMockup } from './PlanMockup'

export function SponsorLanding() {
  const [listeners, setListeners] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null
  const featured = SPONSOR_PLANS.find(p => p.popular) ?? SPONSOR_PLANS[1]

  useEffect(() => {
    fetch('/api/listeners/count').then(r => r.json()).then(d => setListeners(d.count)).catch(() => {})
  }, [])

  return (
    <div className="relative pb-28 md:pb-10">
      {/* Hero */}
      <header className="rounded-3xl overflow-hidden mb-8 relative" style={{
        background: 'linear-gradient(165deg, #14101f 0%, #0e0e16 50%, #07070e 100%)',
        border: '1px solid rgba(219,137,24,0.2)',
      }}>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #40B9BF, #db8918, #7D59B5)' }} />
        <div className="p-6 md:p-8">
          <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.25em] mb-2">{SPONSOR_HERO.eyebrow}</p>
          <div className="md:grid md:grid-cols-[1fr,200px] md:gap-8 items-start">
            <div>
              <h1 className="font-display text-[clamp(1.85rem,6vw,3rem)] text-white leading-[0.95] mb-3">
                {SPONSOR_HERO.title}
              </h1>
              <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xl">{SPONSOR_HERO.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}>
                  {RADIO.frequency}
                </span>
                <span className="text-xs text-white/50 px-3 py-1.5 rounded-full border border-white/10">
                  {RADIO.name} · {RADIO.city}
                </span>
              </div>
            </div>
            {/* Preview mini mockup */}
            <div className="hidden md:block mt-0 rounded-xl overflow-hidden p-2" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <PlanMockup kind="banner-hero" color={featured.color} planId={featured.id} />
              <p className="text-[9px] text-white/35 text-center mt-1">Vista en app</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
            {SPONSOR_STATS.map(s => {
              const isLive = 'live' in s && s.live
              const value = isLive && listeners != null ? String(listeners) : s.value
              return (
                <div key={s.label} className="rounded-xl py-3 px-2 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${s.accent}25` }}>
                  <p className="font-display text-2xl leading-none" style={{ color: s.accent }}>
                    {value}
                    {isLive && listeners != null && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D9A0] ml-0.5 animate-pulse align-middle" />}
                  </p>
                  <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wide font-semibold">{s.label}</p>
                </div>
              )
            })}
          </div>

          <a href={sponsorWaLink()} target="_blank" rel="noopener noreferrer"
            className="mt-6 flex md:inline-flex justify-center w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-[#07070e]"
            style={{ background: 'linear-gradient(135deg, #db8918, #e8a840)' }}>
            Cotizar mi campaña
          </a>
        </div>
      </header>

      <SponsorValueSection />
      <SponsorPlansSection onSelect={p => setSelectedId(p.id)} />

      {/* Proceso */}
      <section className="mb-10 rounded-2xl p-5 md:p-6" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="font-display text-xl text-white mb-4">Cómo empezar</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {SPONSOR_STEPS.map(s => (
            <div key={s.step}>
              <p className="font-mono text-[#db8918] text-xs font-bold">{s.step}</p>
              <p className="text-white font-semibold text-sm mt-1">{s.title}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8 max-w-2xl mx-auto">
        <h2 className="font-display text-xl text-white mb-4 text-center">Preguntas frecuentes</h2>
        <div className="space-y-2">
          {SPONSOR_FAQ.map((item, i) => (
            <div key={item.q} className="rounded-xl overflow-hidden" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-white">
                {item.q}
                <span className="text-white/30">{faqOpen === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-3 text-white/50 text-sm overflow-hidden">{item.a}</motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section className="hidden md:block rounded-2xl p-6 text-center mb-4" style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.2)' }}>
        <p className="text-white font-bold mb-1">¿Listo para salir al aire?</p>
        <a href={sponsorWaLink()} target="_blank" rel="noopener noreferrer"
          className="inline-flex mt-3 px-8 py-3 rounded-xl font-bold text-white" style={{ background: '#128C7E' }}>
          Hablar con ventas
        </a>
      </section>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />

      <div className="fixed left-0 right-0 z-40 p-3 md:hidden border-t border-white/10 backdrop-blur-lg"
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))', background: 'rgba(7,7,14,0.96)' }}>
        <a href={sponsorWaLink()} target="_blank" rel="noopener noreferrer"
          className="flex justify-center w-full py-3.5 rounded-xl font-bold text-white" style={{ background: '#128C7E' }}>
          Cotizar por WhatsApp
        </a>
      </div>
    </div>
  )
}
