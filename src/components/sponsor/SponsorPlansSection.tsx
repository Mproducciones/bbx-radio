'use client'

import { SPONSOR_PLANS, type SponsorPlan } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { AccentButton } from '@/components/shared/AccentButton'

function PlanCard({
  plan,
  onSelect,
}: {
  plan: SponsorPlan
  onSelect: (plan: SponsorPlan) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      className="w-full text-left rounded-xl p-4 border active:scale-[0.99] transition-transform"
      style={{
        borderColor: plan.popular ? `${plan.color}55` : 'rgba(255,255,255,0.1)',
        background: plan.popular
          ? `linear-gradient(135deg, ${plan.color}14 0%, rgba(255,255,255,0.03) 100%)`
          : 'rgba(255,255,255,0.03)',
        boxShadow: plan.popular ? `0 8px 28px -8px ${plan.color}35` : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-white">{plan.nombre}</span>
            {plan.popular && (
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}44` }}
              >
                Recomendado
              </span>
            )}
          </div>
          <p className="text-sm text-white/55 mt-1 leading-snug">{plan.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold text-white tabular-nums leading-none">${plan.precio}</p>
          <p className="text-xs text-white/45 mt-0.5">CLP / mes</p>
        </div>
      </div>
      <p className="text-xs font-medium mt-3" style={{ color: plan.color }}>
        Ver implementación y mockups →
      </p>
    </button>
  )
}

export function SponsorPlansSection({ onSelect }: { onSelect: (plan: SponsorPlan) => void }) {
  const ordered = [SPONSOR_PLANS[0], SPONSOR_PLANS[1], SPONSOR_PLANS[2]]

  return (
    <section id="planes" className="mb-6">
      <h2 className="text-base font-semibold text-white">Planes de publicidad</h2>
      <p className="text-white/55 text-sm mt-1.5 mb-3">Precios en CLP · cotización sin compromiso</p>

      <div className="space-y-2.5">
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
        ))}
      </div>

      <div className="hidden md:block mt-4">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366" fullWidth>
          Cotizar por WhatsApp
        </AccentButton>
      </div>
    </section>
  )
}
