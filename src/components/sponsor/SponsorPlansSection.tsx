'use client'

import { SPONSOR_PLANS, type SponsorPlan } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { PlanPreviewThumb } from './PlanMockup'

function PlanCard({
  plan,
  onSelect,
}: {
  plan: SponsorPlan
  onSelect: (plan: SponsorPlan) => void
}) {
  return (
    <article
      className={[
        'relative flex flex-col rounded-xl overflow-hidden h-full',
        plan.popular ? 'md:-mt-1' : '',
      ].join(' ')}
      style={{
        background: '#0e0e16',
        border: plan.popular ? `1.5px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: plan.popular ? `0 12px 32px ${plan.color}18` : undefined,
      }}
    >
      <div className="h-1 w-full shrink-0" style={{ background: plan.color }} />
      <div className="p-3.5 md:p-4 flex flex-col flex-1">
        {plan.popular && (
          <span
            className="self-start text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5"
            style={{ background: plan.color, color: '#07070e' }}
          >
            Recomendado
          </span>
        )}
        <h3 className="font-display text-lg md:text-xl text-white">{plan.nombre}</h3>
        <p className="text-white/55 text-xs mt-1 min-h-[2rem] leading-snug">{plan.tagline}</p>
        <div className="mt-2 mb-2 flex items-baseline gap-0.5">
          <span className="text-white/40 text-sm">$</span>
          <span className="text-2xl font-bold text-white tabular-nums">{plan.precio}</span>
          <span className="text-white/40 text-xs">/mes</span>
        </div>

        <PlanPreviewThumb planId={plan.id} color={plan.color} compact />

        <div className="flex flex-col gap-1.5 mt-auto pt-2">
          <button
            type="button"
            onClick={() => onSelect(plan)}
            className="w-full min-h-[40px] py-2.5 rounded-lg text-xs font-semibold active:scale-[0.98] transition-transform"
            style={{
              background: plan.popular ? plan.color : `${plan.color}12`,
              color: plan.popular ? '#07070e' : plan.color,
              border: plan.popular ? 'none' : `1px solid ${plan.color}30`,
            }}
          >
            Ver implementación
          </button>
          <a
            href={sponsorWaLink(plan.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-lg text-center text-[11px] font-medium text-white/45 hover:text-white/65"
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

  return (
    <section id="planes" className="mb-6 md:mb-7">
      <div className="mb-3">
        <p className="text-[#db8918] text-[11px] font-semibold uppercase tracking-wide mb-0.5">Inversión mensual</p>
        <h2 className="font-display text-lg md:text-2xl text-white leading-tight">Planes de publicidad</h2>
        <p className="text-white/55 text-xs mt-1">Precios en CLP · cotización sin compromiso</p>
      </div>

      <div className="space-y-2.5 md:space-y-0 md:grid md:grid-cols-3 md:gap-3 md:items-stretch">
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
