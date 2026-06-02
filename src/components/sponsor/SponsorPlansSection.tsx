'use client'

import { useEffect, useRef } from 'react'
import { SPONSOR_PLANS, type SponsorPlan } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { PlanPreviewThumb } from './PlanMockup'

function PlanCard({
  plan,
  onSelect,
  carousel,
}: {
  plan: SponsorPlan
  onSelect: (plan: SponsorPlan) => void
  carousel?: boolean
}) {
  return (
    <article
      data-popular={plan.popular ? '' : undefined}
      className={[
        'relative flex flex-col rounded-2xl overflow-hidden h-full',
        carousel ? 'snap-center shrink-0 w-[min(88vw,320px)]' : '',
        plan.popular ? 'md:-mt-2 md:scale-[1.02]' : '',
      ].join(' ')}
      style={{
        background: '#0e0e16',
        border: plan.popular ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: plan.popular ? `0 20px 50px ${plan.color}20` : undefined,
      }}
    >
      <div className="h-1.5 w-full shrink-0" style={{ background: plan.color }} />
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {plan.popular && (
          <span className="self-start text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
            style={{ background: plan.color, color: '#07070e' }}>
            Recomendado
          </span>
        )}
        <h3 className="font-display text-2xl md:text-3xl text-white">{plan.nombre}</h3>
        <p className="text-white/45 text-sm mt-1.5 min-h-[2.25rem] leading-snug">{plan.tagline}</p>
        <div className="mt-3 mb-3 flex items-baseline gap-1">
          <span className="text-white/35">$</span>
          <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">{plan.precio}</span>
          <span className="text-white/35 text-sm">/mes</span>
        </div>

        <PlanPreviewThumb planId={plan.id} color={plan.color} compact={carousel} />

        <p className="text-white/35 text-[10px] mb-3 leading-snug">
          Toca abajo para ver esquemas de cómo se implementa en la app y en FM.
        </p>

        <div className="flex flex-col gap-2 mt-auto">
          <button
            type="button"
            onClick={() => onSelect(plan)}
            className="w-full min-h-[44px] py-3 rounded-xl text-sm font-bold active:scale-[0.98] transition-transform"
            style={{
              background: plan.popular ? plan.color : `${plan.color}15`,
              color: plan.popular ? '#07070e' : plan.color,
              border: plan.popular ? 'none' : `1px solid ${plan.color}35`,
            }}
          >
            Ver cómo se vería
          </button>
          <a
            href={sponsorWaLink(plan.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[40px] py-2.5 rounded-xl text-center text-xs font-semibold text-white/50 active:text-white/70 flex items-center justify-center"
          >
            WhatsApp directo
          </a>
        </div>
      </div>
    </article>
  )
}

export function SponsorPlansSection({ onSelect }: { onSelect: (plan: SponsorPlan) => void }) {
  const ordered = [SPONSOR_PLANS[0], SPONSOR_PLANS[1], SPONSOR_PLANS[2]]
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || window.matchMedia('(min-width: 768px)').matches) return
    const popular = el.querySelector('[data-popular]')
    popular?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  return (
    <section id="planes" className="mb-8 md:mb-10">
      <div className="mb-4 md:mb-6">
        <p className="text-[#db8918] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Inversión mensual</p>
        <h2 className="font-display text-2xl md:text-4xl text-white leading-none">Planes de publicidad</h2>
        <p className="text-white/40 text-sm mt-1.5">Precios en CLP · cotización sin compromiso</p>
        <p className="md:hidden text-white/25 text-[10px] mt-2 font-semibold uppercase tracking-wider">
          Desliza · botón abre esquemas visuales
        </p>
      </div>

      {/* Móvil: carrusel horizontal con snap */}
      <div
        ref={scrollRef}
        className="md:hidden flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
      >
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} carousel />
        ))}
      </div>

      {/* Desktop: grilla */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 items-stretch">
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
