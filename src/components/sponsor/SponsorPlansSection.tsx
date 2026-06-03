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

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
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
            translateY: [28, 0],
            opacity: [0, 1],
            duration: 560,
            delay: index * 110,
            ease: 'out(3)',
          })
        })
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(plan)}
      className="relative w-full text-left rounded-2xl overflow-hidden opacity-0 active:scale-[0.98] transition-transform"
      style={{
        background: `linear-gradient(150deg, ${plan.color}30 0%, #0d0d1a 55%, #09090f 100%)`,
        border: `1.5px solid ${plan.popular ? plan.color + '65' : plan.color + '30'}`,
        boxShadow: plan.popular
          ? `0 0 0 1px ${plan.color}18, 0 16px 56px -10px ${plan.color}45`
          : `0 6px 28px -6px ${plan.color}28`,
      }}
    >
      {/* Top color bar */}
      <div
        className="h-1.5"
        style={{ background: `linear-gradient(90deg, ${plan.color} 0%, ${plan.color}88 55%, transparent 100%)` }}
      />

      <div className="p-4 pb-5">

        {/* Icon + Plan name */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${plan.color}22`, border: `1px solid ${plan.color}38` }}
            >
              {PLAN_ICONS[plan.id]}
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">{plan.nombre}</p>
              {plan.popular ? (
                <span
                  className="inline-block mt-1 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{ background: `${plan.color}28`, color: plan.color, border: `1px solid ${plan.color}55` }}
                >
                  ★ Más elegido
                </span>
              ) : (
                <p className="text-white/40 text-[11px] mt-0.5">{plan.tagline}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            <p className="font-black tabular-nums leading-none" style={{ color: plan.color, fontSize: '1.85rem' }}>
              ${plan.precio}
            </p>
            <p className="text-[9px] text-white/35 mt-1">al mes · CLP</p>
          </div>
        </div>

        {plan.popular && (
          <p className="text-white/45 text-xs mb-3 leading-relaxed">{plan.tagline}</p>
        )}

        {/* Divider */}
        <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${plan.color}30, transparent)` }} />

        {/* Features */}
        <ul className="space-y-2 mb-4">
          {plan.features.map(f => (
            <li key={f} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${plan.color}22` }}
              >
                <CheckIcon color={plan.color} />
              </div>
              <span className="text-white/75 text-sm">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <div
          className="w-full py-2.5 rounded-xl text-center text-xs font-bold"
          style={
            plan.popular
              ? {
                  background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}cc 100%)`,
                  color: '#07070e',
                  boxShadow: `0 4px 16px -4px ${plan.color}55`,
                }
              : {
                  background: `${plan.color}16`,
                  color: plan.color,
                  border: `1px solid ${plan.color}35`,
                }
          }
        >
          Ver plan completo →
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
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Tarifas
        </p>
        <h2 className="text-xl font-bold text-white leading-tight">Planes de publicidad</h2>
        <p className="text-white/45 text-sm mt-1 leading-relaxed">
          Toca un plan para ver pantallas y detalle completo
        </p>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {ordered.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} index={i} />
        ))}
      </div>

      {/* Desktop: tabla resumen + cards */}
      <div className="hidden md:block">
        <div className="rounded-2xl border border-white/8 overflow-hidden mb-4 text-xs">
          <div
            className="grid grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)] font-semibold text-white/40"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="px-4 py-3">Plan</div>
            <div className="px-4 py-3 text-right">Precio/mes</div>
            <div className="px-4 py-3">Incluye</div>
          </div>
          {ordered.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan)}
              className="grid grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)] w-full text-left hover:bg-white/[0.03] transition-colors border-t border-white/5"
            >
              <div className="px-4 py-3 flex items-center gap-2">
                <span>{PLAN_ICONS[plan.id]}</span>
                <span className="text-white font-semibold">{plan.nombre}</span>
                {plan.popular && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${plan.color}22`, color: plan.color }}>
                    ★
                  </span>
                )}
              </div>
              <div className="px-4 py-3 text-right tabular-nums font-bold whitespace-nowrap"
                style={{ color: plan.color }}>
                ${plan.precio}
              </div>
              <div className="px-4 py-3 text-white/45 leading-snug line-clamp-1">
                {plan.features.join(' · ')}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {ordered.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} onSelect={onSelect} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366" fullWidth>
          Cotizar por WhatsApp
        </AccentButton>
      </div>
    </section>
  )
}
