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
  const heroRef = useRef<HTMLElement>(null)
  const [listeners, setListeners] = useState<number | null>(initialListeners ?? null)
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  usePageAnimations(rootRef)

  // Anime.js hero stagger entrance
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    import('animejs').then(({ animate, stagger }) => {
      animate(el.querySelectorAll('[data-hero-item]'), {
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 600,
        delay: stagger(100),
        ease: 'out(3)',
      })
    })
  }, [])

  // Anime.js stat tiles with spring
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const tiles = el.querySelectorAll('[data-stat-tile]')
    import('animejs').then(({ animate, stagger }) => {
      animate(tiles, {
        scale: [0.88, 1],
        opacity: [0, 1],
        duration: 500,
        delay: stagger(80, { start: 350 }),
        ease: 'spring(1, 90, 12, 0)',
      })
    })
  }, [])

  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null

  useEffect(() => {
    fetch('/api/listeners/count')
      .then(r => r.json())
      .then(d => setListeners(typeof d.count === 'number' ? d.count : null))
      .catch(() => {})
  }, [])

  return (
    <div ref={rootRef} className="relative w-full min-w-0 overflow-x-hidden max-md:pb-[calc(var(--app-nav-total)+5.75rem)] md:pb-8">
      {/* ── HERO compacto — máximo 3 líneas antes del contenido ── */}
      <header ref={heroRef} className="pb-4 mb-0">
        {/* Eyebrow */}
        <p data-hero-item className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-widest mb-2 opacity-0">
          {SPONSOR_HERO.eyebrow}
        </p>

        {/* Título + radio info en una sola fila */}
        <div data-hero-item className="opacity-0 mb-3">
          <h1 className="text-xl font-bold text-white leading-snug">
            {SPONSOR_HERO.title}
          </h1>
          <p className="text-white/45 text-xs mt-1">
            <span className="text-[#db8918] font-semibold">{RADIO.frequency}</span>
            <span className="mx-1">·</span>
            {RADIO.name}, {RADIO.city}
          </p>
        </div>

        {/* Stats — pills horizontales en mobile, grid en desktop */}
        <div
          data-hero-item
          className="opacity-0 flex md:grid md:grid-cols-4 gap-2 overflow-x-auto overscroll-x-contain pb-1 -mx-0.5 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SPONSOR_STATS.map(s => {
            const isLive = 'live' in s && s.live
            const value: string =
              isLive && listeners != null
                ? listeners > 0 ? String(listeners) : 'En vivo'
                : s.value
            return (
              <div
                key={s.label}
                data-stat-tile
                className="shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/10 md:flex-col md:items-start md:gap-1"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <p
                  className="font-bold tabular-nums leading-none text-lg whitespace-nowrap"
                  style={{ color: s.accent }}
                >
                  {value}
                  {isLive && listeners != null && listeners > 0 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D9A0] ml-1 align-middle animate-pulse" />
                  )}
                </p>
                <p className="text-[10px] text-white/45 leading-tight whitespace-nowrap">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Subtítulo — solo en desktop */}
        <p data-hero-item className="hidden md:block text-white/55 text-sm leading-relaxed mt-4 opacity-0">
          {SPONSOR_HERO.subtitle}
        </p>
      </header>

      <SponsorSectionNav />

      {/* Planes PRIMERO — es la decisión más importante */}
      <SponsorPlansSection onSelect={p => setSelectedId(p.id)} />

      {/* Beneficios — después de ver los planes */}
      <SponsorValueSection />

      <SponsorLiveSection />

      <p className="mb-6 text-center" data-animate="fade">
        <a href="/patrocinadores" className="text-sm font-medium text-[#40B9BF] hover:text-white">
          Ver marcas activas en la app →
        </a>
      </p>

      <section id="pasos" className="mb-6 border-t border-white/8 pt-5 scroll-mt-14">
        <h2 className="text-base font-semibold text-white mb-4" data-animate="fade">
          Cómo empezar
        </h2>
        <ol className="space-y-0 rounded-2xl overflow-hidden border border-white/8 divide-y divide-white/8">
          {SPONSOR_STEPS.map((s, i) => (
            <li
              key={s.step}
              className="flex items-center gap-4 px-4 py-4"
              data-animate="tile"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black shrink-0"
                style={{ background: 'rgba(219,137,24,0.12)', color: '#db8918' }}
              >
                {i + 1}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-white/45 text-xs leading-snug mt-0.5">{s.desc}</p>
              </div>
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
