'use client'

import { SPONSOR_PLANS, type SponsorPlan } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'

function Check({ color }: { color: string }) {
  return (
    <span className="inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0"
      style={{ background: `${color}22`, color }}>
      ✓
    </span>
  )
}

export function SponsorPlansSection({ onSelect }: { onSelect: (plan: SponsorPlan) => void }) {
  const ordered = [SPONSOR_PLANS[0], SPONSOR_PLANS[1], SPONSOR_PLANS[2]]

  return (
    <section id="planes" className="mb-10">
      <div className="mb-6">
        <p className="text-[#db8918] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Inversión mensual</p>
        <h2 className="font-display text-3xl md:text-4xl text-white leading-none">Planes de publicidad</h2>
        <p className="text-white/40 text-sm mt-2">Precios en CLP · cotización sin compromiso</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 items-stretch">
        {ordered.map(plan => (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-2xl overflow-hidden ${plan.popular ? 'md:-mt-2 md:scale-[1.02]' : ''}`}
            style={{
              background: '#0e0e16',
              border: plan.popular ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
              boxShadow: plan.popular ? `0 20px 50px ${plan.color}20` : undefined,
            }}
          >
            <div className="h-1.5 w-full" style={{ background: plan.color }} />
            <div className="p-5 flex flex-col flex-1">
              {plan.popular && (
                <span className="self-start text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
                  style={{ background: plan.color, color: '#07070e' }}>
                  Recomendado
                </span>
              )}
              <h3 className="font-display text-3xl text-white">{plan.nombre}</h3>
              <p className="text-white/45 text-sm mt-2 min-h-[2.5rem] leading-snug">{plan.tagline}</p>
              <div className="mt-4 mb-4 flex items-baseline gap-1">
                <span className="text-white/35">$</span>
                <span className="text-4xl font-bold text-white tabular-nums">{plan.precio}</span>
                <span className="text-white/35 text-sm">/mes</span>
              </div>
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2 text-sm text-white/75">
                    <Check color={plan.color} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 mt-auto">
                <button type="button" onClick={() => onSelect(plan)}
                  className="w-full py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: plan.popular ? plan.color : `${plan.color}15`,
                    color: plan.popular ? '#07070e' : plan.color,
                    border: plan.popular ? 'none' : `1px solid ${plan.color}35`,
                  }}>
                  Ver ejemplos visuales
                </button>
                <a href={sponsorWaLink(plan.nombre)} target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white/50 hover:text-white/70">
                  WhatsApp directo
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
