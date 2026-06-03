'use client'

import { SPONSOR_PLANS, type SponsorPlan } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { accentTileStyle } from '@/lib/accentUi'
import { AccentButton } from '@/components/shared/AccentButton'

function PlanTile({
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
      className="relative flex flex-col items-center text-center min-w-0 p-2 rounded-xl overflow-hidden transition-all active:scale-[0.98]"
      style={accentTileStyle(plan.color, !!plan.popular)}
    >
      {plan.popular && (
        <span
          className="text-[8px] font-bold uppercase tracking-wide mb-1 leading-none"
          style={{ color: plan.color }}
        >
          Top
        </span>
      )}
      <p className="text-[10px] font-semibold text-white uppercase leading-tight">{plan.nombre}</p>
      <p className="text-xs font-semibold text-white tabular-nums mt-1 leading-none">
        ${plan.precio}
      </p>
      <p className="text-[9px] text-white/40">/mes</p>
      <p className="text-[9px] text-white/45 mt-1.5 line-clamp-2 leading-snug">{plan.tagline}</p>
      <span className="text-[9px] text-white/35 mt-1">Ver +</span>
    </button>
  )
}

export function SponsorPlansSection({ onSelect }: { onSelect: (plan: SponsorPlan) => void }) {
  const ordered = [SPONSOR_PLANS[0], SPONSOR_PLANS[1], SPONSOR_PLANS[2]]

  return (
    <section id="planes" className="mb-4">
      <h2 className="text-sm font-semibold text-white">Planes de publicidad</h2>
      <p className="text-white/45 text-[11px] mb-2">CLP · toca un plan para ver implementación</p>

      <div className="grid grid-cols-3 gap-2">
        {ordered.map(plan => (
          <PlanTile key={plan.id} plan={plan} onSelect={onSelect} />
        ))}
      </div>

      <div className="mt-3">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366" fullWidth>
          Cotizar por WhatsApp
        </AccentButton>
      </div>
    </section>
  )
}
