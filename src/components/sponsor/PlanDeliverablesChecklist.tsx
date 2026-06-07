'use client'

import { useRouter } from 'next/navigation'
import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { deliverablesForPlan, channelLabel } from '@/lib/sponsorPlanDeliverables'
import { activateSponsorDemoTier } from '@/lib/sponsorDemoSession'

export function PlanDeliverablesChecklist({ planId, color }: { planId: SponsorPlanId; color: string }) {
  const router = useRouter()
  const items = deliverablesForPlan(planId)

  function openPreview(href: string) {
    activateSponsorDemoTier(planId)
    router.push(href)
  }

  return (
    <section
      className="plan-deliverables"
      style={{ '--plan-accent': color } as React.CSSProperties}
      aria-labelledby="plan-deliverables-heading"
    >
      <h3 id="plan-deliverables-heading" className="plan-deliverables__title">
        Qué incluye este plan (verificable)
      </h3>

      <ul className="plan-deliverables__list">
        {items.map(d => (
          <li key={d.id} className="plan-deliverables__item">
            <span className="plan-deliverables__mark" aria-hidden>
              {d.inApp ? '✓' : '○'}
            </span>
            <div className="plan-deliverables__copy">
              <p className="plan-deliverables__label">{d.label}</p>
              <p className="plan-deliverables__channel">{channelLabel(d.channel)}</p>
              {d.note && <p className="plan-deliverables__note">{d.note}</p>}
              {d.inApp && d.previewHref && (
                <button
                  type="button"
                  onClick={() => openPreview(d.previewHref!)}
                  className="plan-deliverables__link text-left"
                >
                  Ver en la app
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="plan-deliverables__legend">
        ✓ = visible en la PWA · ○ = radio o gestión comercial (no es pantalla de la app)
      </p>
    </section>
  )
}
