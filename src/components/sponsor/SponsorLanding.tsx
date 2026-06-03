'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlanId } from '@/lib/sponsorPlans'
import { SPONSOR_FAQ, SPONSOR_HERO, SPONSOR_STATS, SPONSOR_STEPS, sponsorWaLink } from '@/lib/sponsorContent'
import { PlanDetailSheet } from './PlanDetailSheet'
import { SponsorValueSection } from './SponsorValueSection'
import { SponsorPlansSection } from './SponsorPlansSection'
import { SponsorLiveSection } from './SponsorLiveSection'
import { SponsorSectionNav } from './SponsorSectionNav'
import { AccentButton } from '@/components/shared/AccentButton'
import { usePageAnimations } from '@/hooks/usePageAnimations'

export function SponsorLanding({ initialListeners }: { initialListeners?: number }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [listeners, setListeners] = useState<number | null>(initialListeners ?? null)
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  usePageAnimations(rootRef)

  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null

  useEffect(() => {
    fetch('/api/listeners/count')
      .then(r => r.json())
      .then(d => setListeners(typeof d.count === 'number' ? d.count : null))
      .catch(() => {})
  }, [])

  return (
    <div ref={rootRef} className="relative w-full min-w-0 overflow-x-hidden max-md:pb-[calc(var(--app-nav-total)+5.75rem)] md:pb-8">
      <header className="border-b border-white/10 pb-5 mb-2" data-animate="fade">
        <p className="text-[#40B9BF] text-xs font-semibold uppercase tracking-wide mb-2">
          {SPONSOR_HERO.eyebrow}
        </p>
        <h1 className="text-xl font-semibold text-white leading-snug mb-2">{SPONSOR_HERO.title}</h1>
        <p className="text-white/60 text-sm leading-relaxed">{SPONSOR_HERO.subtitle}</p>
        <p className="mt-2 text-sm text-white/50">
          <span className="text-[#db8918] font-medium">{RADIO.frequency}</span>
          <span className="mx-1.5">·</span>
          {RADIO.name}, {RADIO.city}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {SPONSOR_STATS.map(s => {
            const isLive = 'live' in s && s.live
            const value: string =
              isLive && listeners != null
                ? listeners > 0
                  ? String(listeners)
                  : 'En vivo'
                : s.value
            return (
              <div
                key={s.label}
                className="rounded-xl px-3 py-2.5 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <p
                  className={`font-bold tabular-nums leading-none ${isLive && listeners === 0 ? 'text-sm' : 'text-lg'}`}
                  style={{ color: s.accent }}
                >
                  {value}
                  {isLive && listeners != null && listeners > 0 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D9A0] ml-1 align-middle animate-pulse" />
                  )}
                </p>
                <p className="text-xs text-white/50 mt-1 leading-tight">{s.label}</p>
              </div>
            )
          })}
        </div>
      </header>

      <SponsorSectionNav />

      <SponsorValueSection />
      <SponsorPlansSection onSelect={p => setSelectedId(p.id)} />
      <SponsorLiveSection />

      <p className="mb-6 text-center" data-animate="fade">
        <a href="/patrocinadores" className="text-sm font-medium text-[#40B9BF] hover:text-white">
          Ver marcas activas en la app →
        </a>
      </p>

      <section id="pasos" className="mb-6 border-t border-white/8 pt-5 scroll-mt-14">
        <h2 className="text-base font-semibold text-white mb-3" data-animate="fade">
          Cómo empezar
        </h2>
        <ol className="space-y-3">
          {SPONSOR_STEPS.map(s => (
            <li key={s.step} className="flex gap-3 text-sm" data-animate="tile">
              <span className="text-[#db8918] font-mono font-bold shrink-0 w-6">{s.step}</span>
              <span className="leading-relaxed">
                <span className="text-white font-semibold">{s.title}</span>
                <span className="text-white/50"> — {s.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" className="mb-4 scroll-mt-14 md:max-w-xl md:mx-auto">
        <h2 className="text-base font-semibold text-white mb-3 md:text-center" data-animate="fade">
          Preguntas frecuentes
        </h2>
        <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/8">
          {SPONSOR_FAQ.map((item, i) => (
            <div key={item.q} data-animate="tile">
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex justify-between gap-3 px-3.5 py-3.5 text-left text-sm text-white/90 active:bg-white/[0.03]"
              >
                <span className="font-medium leading-snug">{item.q}</span>
                <span className="text-white/35 shrink-0">{faqOpen === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {faqOpen === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3.5 pb-3.5 text-sm text-white/60 leading-relaxed overflow-hidden"
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
        className="sponsor-sticky-cta md:hidden fixed left-0 right-0 z-[999] pt-2.5 pointer-events-none border-t border-white/10 backdrop-blur-xl box-border"
        style={{
          bottom: 'var(--app-nav-total)',
          background: '#07070e',
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
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

      <p className="hidden md:block text-center mb-2" data-animate="cta">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366">
          Hablar con ventas por WhatsApp
        </AccentButton>
      </p>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />
    </div>
  )
}
