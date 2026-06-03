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
      data-animate="tile"
      onClick={() => onSelect(plan)}
      className="w-full min-w-0 text-left rounded-xl p-3.5 sm:p-4 border active:scale-[0.99] transition-transform"
      style={{
        borderColor: plan.popular ? `${plan.color}55` : 'rgba(255,255,255,0.1)',
        background: plan.popular
          ? `linear-gradient(135deg, ${plan.color}14 0%, rgba(255,255,255,0.03) 100%)`
          : 'rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-white">{plan.nombre}</span>
            {plan.popular && (
              <span
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                style={{ background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}44` }}
              >
                Recomendado
              </span>
            )}
          </div>
          <p className="text-sm text-white/55 mt-1">{plan.tagline}</p>
          <ul className="mt-2 space-y-0.5">
            {plan.features.map(f => (
              <li key={f} className="text-xs text-white/45 flex gap-1.5">
                <span style={{ color: plan.color }}>·</span>
                <span className="break-words">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg sm:text-xl font-bold text-white tabular-nums">${plan.precio}</p>
          <p className="text-xs text-white/45">/mes CLP</p>
        </div>
      </div>
      <p className="text-xs font-medium mt-3" style={{ color: plan.color }}>
        Ver mockups e implementación →
      </p>
    </button>
  )
}

export function SponsorPlansSection({ onSelect }: { onSelect: (plan: SponsorPlan) => void }) {
  const ordered = [SPONSOR_PLANS[0], SPONSOR_PLANS[1], SPONSOR_PLANS[2]]

  return (
    <section id="planes" className="mb-6 scroll-mt-14 min-w-0">
      <div data-animate="fade" className="mb-3 min-w-0">
        <h2 className="text-base font-semibold text-white">Planes de publicidad</h2>
        <p className="text-white/55 text-sm mt-1 leading-relaxed">
          Precios en CLP · toca un plan para ver pantallas y detalle completo
        </p>
      </div>

      <div
        className="hidden md:block rounded-xl border border-white/10 overflow-hidden mb-3 text-xs min-w-0"
        data-animate="fade"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)] gap-px bg-white/10 font-semibold text-white/50">
          <div className="bg-[#0c0c14] px-3 py-2">Plan</div>
          <div className="bg-[#0c0c14] px-3 py-2 text-right">Precio</div>
          <div className="bg-[#0c0c14] px-3 py-2">Incluye</div>
        </div>
        {ordered.map(plan => (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan)}
            className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)] gap-px bg-white/10 w-full text-left active:bg-white/[0.04]"
          >
            <div className="bg-[#0c0c14] px-3 py-2.5 text-white font-medium truncate">{plan.nombre}</div>
            <div className="bg-[#0c0c14] px-3 py-2.5 text-right tabular-nums text-white whitespace-nowrap">
              ${plan.precio}
            </div>
            <div className="bg-[#0c0c14] px-3 py-2.5 text-white/55 leading-snug line-clamp-2">
              {plan.features.join(' · ')}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2.5 min-w-0">
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
        ))}
      </div>

      <div className="hidden md:block mt-4" data-animate="cta">
        <AccentButton href={sponsorWaLink()} accent="#128C7E" highlight="#25D366" fullWidth>
          Cotizar por WhatsApp
        </AccentButton>
      </div>
    </section>
  )
}
