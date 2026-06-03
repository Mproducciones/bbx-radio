'use client'

import { useEffect, useRef } from 'react'
import { SPONSOR_PLANS, type SponsorPlan } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { AccentButton } from '@/components/shared/AccentButton'

const PLAN_ICONS: Record<string, string> = {
  basico: '📻',
  premium: '🚀',
  empresarial: '🏆',
}

const PLAN_SETUP: Record<string, string> = {
  basico: '$80.000',
  premium: '$100.000',
  empresarial: '$150.000',
}

function PlanCard({ plan, onSelect, index }: {
  plan: SponsorPlan
  onSelect: (plan: SponsorPlan) => void
  index: number
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        import('animejs').then(({ animate }) => {
          animate(el, {
            translateY: [32, 0],
            opacity: [0, 1],
            duration: 550,
            delay: index * 120,
            ease: 'out(3)',
          })
        })
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(plan)}
      className="w-full text-left rounded-2xl overflow-hidden transition-transform active:scale-[0.99] opacity-0"
      style={{
        background: plan.popular
          ? `linear-gradient(150deg, ${plan.color}18 0%, rgba(255,255,255,0.03) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: plan.popular ? `1px solid ${plan.color}50` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: plan.popular ? `0 4px 32px ${plan.color}18` : 'none',
      }}
    >
      {/* Color accent top */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{PLAN_ICONS[plan.id]}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold text-base">{plan.nombre}</span>
                {plan.popular && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                    style={{ background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}44` }}>
                    ⭐ Recomendado
                  </span>
                )}
              </div>
              <p className="text-white/45 text-xs mt-0.5">{plan.tagline}</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-black tabular-nums leading-none" style={{ color: plan.color }}>
              ${plan.precio}
            </p>
            <p className="text-[9px] text-white/35">/mes CLP</p>
            <p className="text-[9px] text-white/25 mt-0.5">Setup {PLAN_SETUP[plan.id]}</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1 mb-3">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-xs text-white/55">
              <span className="mt-0.5 flex-shrink-0" style={{ color: plan.color }}>✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA hint */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold" style={{ color: plan.color }}>
            Ver mockups completos →
          </p>
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: `${plan.color}18` }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={plan.color}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}

export function SponsorPlansSection({ onSelect }: { onSelect: (plan: SponsorPlan) => void }) {
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        import('animejs').then(({ animate }) => {
          animate(el, { translateY: [16, 0], opacity: [0, 1], duration: 500, ease: 'out(3)' })
        })
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const ordered = [SPONSOR_PLANS[0], SPONSOR_PLANS[1], SPONSOR_PLANS[2]]

  return (
    <section id="planes" className="mb-8 scroll-mt-14">
      <div ref={titleRef} className="mb-4 opacity-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Tarifas</p>
        <h2 className="text-xl font-bold text-white leading-tight">Planes de publicidad</h2>
        <p className="text-white/50 text-sm mt-1 leading-relaxed">
          Precios en CLP · toca un plan para ver pantallas y detalle completo
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-white/10 overflow-hidden mb-4 text-xs">
        <div className="grid grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)] bg-white/5 font-semibold text-white/50">
          <div className="px-4 py-2.5">Plan</div>
          <div className="px-4 py-2.5 text-right">Precio/mes</div>
          <div className="px-4 py-2.5">Incluye</div>
        </div>
        {ordered.map(plan => (
          <button key={plan.id} type="button" onClick={() => onSelect(plan)}
            className="grid grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)] divide-x divide-white/5 w-full text-left hover:bg-white/[0.03] transition-colors border-t border-white/5">
            <div className="px-4 py-3 flex items-center gap-2">
              <span>{PLAN_ICONS[plan.id]}</span>
              <span className="text-white font-semibold">{plan.nombre}</span>
              {plan.popular && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: `${plan.color}22`, color: plan.color }}>★</span>}
            </div>
            <div className="px-4 py-3 text-right tabular-nums text-white font-bold whitespace-nowrap">
              ${plan.precio}
            </div>
            <div className="px-4 py-3 text-white/50 leading-snug line-clamp-1">
              {plan.features.join(' · ')}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {ordered.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} index={i} />
        ))}
      </div>

      {/* Desktop cards */}
      <div className="hidden md:grid md:grid-cols-3 gap-3 mt-3">
        {ordered.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} index={i} />
        ))}
      </div>

      <div className="mt-5">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366" fullWidth>
          Cotizar por WhatsApp
        </AccentButton>
      </div>
    </section>
  )
}
