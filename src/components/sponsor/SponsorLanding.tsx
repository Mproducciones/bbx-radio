'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlanId } from '@/lib/sponsorPlans'
import { SPONSOR_FAQ, SPONSOR_HERO, SPONSOR_STATS, SPONSOR_STEPS, sponsorWaLink } from '@/lib/sponsorContent'
import { PlanMockup } from './PlanMockup'
import { PlanDetailSheet } from './PlanDetailSheet'
import { SponsorValueSection } from './SponsorValueSection'
import { SponsorPlansSection } from './SponsorPlansSection'
import { SponsorLiveSection } from './SponsorLiveSection'

export function SponsorLanding({ initialListeners }: { initialListeners?: number }) {
  const [listeners, setListeners] = useState<number | null>(initialListeners ?? null)
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null
  const featured = SPONSOR_PLANS.find(p => p.popular) ?? SPONSOR_PLANS[1]

  useEffect(() => {
    fetch('/api/listeners/count').then(r => r.json()).then(d => setListeners(d.count)).catch(() => {})
  }, [])

  return (
    <div className="relative max-md:pb-[calc(var(--app-nav-total)+3.75rem)] md:pb-10">
      <header
        className="rounded-2xl overflow-hidden mb-5 md:mb-6 relative"
        style={{
          background: 'linear-gradient(165deg, #14101f 0%, #0e0e16 50%, #07070e 100%)',
          border: '1px solid rgba(219,137,24,0.2)',
        }}
      >
        <div className="h-1 w-full shrink-0" style={{ background: 'linear-gradient(90deg, #40B9BF, #db8918, #7D59B5)' }} />
        <div className="p-4 md:p-6 flex flex-col">
          <p className="text-[#40B9BF] text-[11px] font-semibold uppercase tracking-[0.12em] mb-1">{SPONSOR_HERO.eyebrow}</p>

          <div className="md:grid md:grid-cols-[1fr,180px] md:gap-6 items-start">
            <div>
              <h1 className="font-display text-[clamp(1.35rem,5.5vw,2.25rem)] text-white leading-[1.05] mb-2">
                {SPONSOR_HERO.title}
              </h1>
              <p className="text-white/65 text-sm leading-relaxed max-w-xl">{SPONSOR_HERO.subtitle}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}>
                  {RADIO.frequency}
                </span>
                <span className="text-[11px] text-white/55 px-2.5 py-1 rounded-full border border-white/10">
                  {RADIO.name} · {RADIO.city}
                </span>
              </div>
            </div>

          {/* Preview móvil oculto en hero pantalla completa — se ve en planes */}
          <div className="hidden rounded-xl overflow-hidden p-2 md:block" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <PlanMockup kind="banner-hero" color={featured.color} planId={featured.id} />
              <p className="text-[9px] text-white/35 text-center mt-1">Vista en app</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {SPONSOR_STATS.map(s => {
              const isLive = 'live' in s && s.live
              const value = isLive && listeners != null ? String(listeners) : s.value
              return (
                <div key={s.label} className="rounded-lg py-2 px-2 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${s.accent}25` }}>
                  <p className="font-display text-lg md:text-xl leading-none tabular-nums" style={{ color: s.accent }}>
                    {value}
                    {isLive && listeners != null && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D9A0] ml-0.5 animate-pulse align-middle" />}
                  </p>
                  <p className="text-white/55 text-[10px] mt-1 uppercase tracking-wide font-medium leading-tight">{s.label}</p>
                </div>
              )
            })}
          </div>

          <a
            href={sponsorWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#07070e]"
            style={{ background: 'linear-gradient(135deg, #db8918, #e8a840)' }}
          >
            Cotizar mi campaña
          </a>
        </div>
      </header>

      <SponsorValueSection />
      <SponsorPlansSection onSelect={p => setSelectedId(p.id)} />
      <SponsorLiveSection />

      <section className="mb-5 text-center">
        <a
          href="/patrocinadores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#40B9BF] hover:text-white transition-colors"
        >
          Ver marcas que ya anuncian en la app
          <span aria-hidden>→</span>
        </a>
      </section>

      <section className="mb-6 rounded-xl p-4 md:p-5" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="font-display text-base md:text-lg text-white mb-3">Cómo empezar</h2>
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
          {SPONSOR_STEPS.map(s => (
            <div key={s.step} className="flex gap-3 md:block">
              <p className="font-mono text-[#db8918] text-xs font-bold shrink-0 w-8 md:w-auto">{s.step}</p>
              <div>
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5 md:max-w-2xl md:mx-auto">
        <h2 className="font-display text-base md:text-lg text-white mb-3 md:text-center">Preguntas frecuentes</h2>
        <div className="space-y-2">
          {SPONSOR_FAQ.map((item, i) => (
            <div key={item.q} className="rounded-xl overflow-hidden" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex justify-between gap-3 px-4 py-4 md:py-3.5 text-left text-sm font-semibold text-white min-h-[48px] items-center active:bg-white/[0.03]"
              >
                <span className="pr-2">{item.q}</span>
                <span className="text-white/30 shrink-0 text-lg leading-none">{faqOpen === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 text-white/50 text-sm overflow-hidden leading-relaxed"
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
        className="sponsor-sticky-cta md:hidden fixed left-0 right-0 z-[999] px-4 py-1.5 pointer-events-none"
        style={{
          bottom: 'var(--app-nav-total)',
          background: 'linear-gradient(180deg, transparent 0%, rgba(7,7,14,0.94) 40%)',
        }}
      >
        <a
          href={sponsorWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex justify-center w-full max-w-md mx-auto min-h-[44px] items-center py-2.5 rounded-lg text-sm font-semibold text-white active:scale-[0.98] transition-transform"
          style={{ background: '#128C7E', boxShadow: '0 2px 16px rgba(18,140,126,0.3)' }}
        >
          Cotizar por WhatsApp
        </a>
      </div>

      <section className="hidden md:block rounded-xl p-5 text-center mb-4" style={{ background: 'rgba(18,140,126,0.08)', border: '1px solid rgba(18,140,126,0.2)' }}>
        <p className="text-white font-semibold text-sm mb-1">¿Listo para salir al aire?</p>
        <a href={sponsorWaLink()} target="_blank" rel="noopener noreferrer"
          className="inline-flex mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#128C7E' }}>
          Hablar con ventas
        </a>
      </section>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />
    </div>
  )
}
