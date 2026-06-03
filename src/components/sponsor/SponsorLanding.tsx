'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlanId } from '@/lib/sponsorPlans'
import { SPONSOR_FAQ, SPONSOR_HERO, SPONSOR_STATS, SPONSOR_STEPS, sponsorWaLink } from '@/lib/sponsorContent'
import { PlanDetailSheet } from './PlanDetailSheet'
import { SponsorValueSection } from './SponsorValueSection'
import { SponsorPlansSection } from './SponsorPlansSection'
import { SponsorLiveSection } from './SponsorLiveSection'
import { AccentButton } from '@/components/shared/AccentButton'

export function SponsorLanding({ initialListeners }: { initialListeners?: number }) {
  const [listeners, setListeners] = useState<number | null>(initialListeners ?? null)
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null

  useEffect(() => {
    fetch('/api/listeners/count').then(r => r.json()).then(d => setListeners(d.count)).catch(() => {})
  }, [])

  return (
    <div className="relative max-md:pb-[calc(var(--app-nav-total)+2.5rem)] md:pb-8">
      <header className="border-b border-white/8 pb-4 mb-4">
        <p className="text-[#40B9BF] text-[10px] font-medium uppercase tracking-wide mb-1">{SPONSOR_HERO.eyebrow}</p>
        <h1 className="text-base font-semibold text-white leading-snug mb-1.5">{SPONSOR_HERO.title}</h1>
        <p className="text-white/60 text-xs leading-relaxed">{SPONSOR_HERO.subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-white/50">
          <span className="text-[#db8918] font-medium">{RADIO.frequency}</span>
          <span>·</span>
          <span>{RADIO.name}, {RADIO.city}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs">
          {SPONSOR_STATS.map(s => {
            const isLive = 'live' in s && s.live
            const value = isLive && listeners != null ? String(listeners) : s.value
            return (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="font-semibold tabular-nums" style={{ color: s.accent }}>
                  {value}
                  {isLive && listeners != null && (
                    <span className="inline-block w-1 h-1 rounded-full bg-[#00D9A0] ml-0.5 animate-pulse align-middle" />
                  )}
                </span>
                <span className="text-white/45 text-[10px] uppercase">{s.label}</span>
              </div>
            )
          })}
        </div>

        <a
          href={sponsorWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block mt-3 text-xs font-medium text-[#db8918] hover:text-[#e8a840]"
        >
          Cotizar campaña →
        </a>
      </header>

      <SponsorValueSection />
      <SponsorPlansSection onSelect={p => setSelectedId(p.id)} />
      <SponsorLiveSection />

      <p className="mb-4 text-center">
        <a href="/patrocinadores" className="text-xs text-[#40B9BF] hover:text-white">
          Ver marcas en la app →
        </a>
      </p>

      <section className="mb-4 border-t border-white/8 pt-4">
        <h2 className="text-sm font-semibold text-white mb-2">Cómo empezar</h2>
        <ol className="space-y-2">
          {SPONSOR_STEPS.map(s => (
            <li key={s.step} className="flex gap-2 text-xs">
              <span className="text-[#db8918] font-mono shrink-0">{s.step}</span>
              <span>
                <span className="text-white font-medium">{s.title}</span>
                <span className="text-white/45"> — {s.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-4 md:max-w-xl md:mx-auto">
        <h2 className="text-sm font-semibold text-white mb-2 md:text-center">FAQ</h2>
        <div className="divide-y divide-white/8 border-y border-white/8">
          {SPONSOR_FAQ.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex justify-between gap-2 py-2.5 text-left text-xs text-white/90 active:bg-white/[0.02]"
              >
                <span>{item.q}</span>
                <span className="text-white/30 shrink-0">{faqOpen === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-2.5 text-white/55 text-xs leading-relaxed overflow-hidden"
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <div
        className="sponsor-sticky-cta md:hidden fixed left-0 right-0 z-[999] px-3 pt-2 pointer-events-none border-t border-white/10 backdrop-blur-xl"
        style={{
          bottom: 'var(--app-nav-total)',
          background: 'rgba(7,7,14,0.96)',
          boxShadow: '0 -12px 40px rgba(0,0,0,0.45)',
        }}
      >
        <AccentButton
          href={sponsorWaLink()}
          accent="#128C7E"
          highlight="#25D366"
          fullWidth
          className="pointer-events-auto"
        >
          Cotizar por WhatsApp
        </AccentButton>
      </div>

      <p className="hidden md:block text-center mb-2">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366">
          Hablar con ventas por WhatsApp
        </AccentButton>
      </p>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />
    </div>
  )
}
