'use client'

import Link from 'next/link'
import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { deliverablesForPlan, channelLabel } from '@/lib/sponsorPlanDeliverables'

export function PlanDeliverablesChecklist({ planId, color }: { planId: SponsorPlanId; color: string }) {
  const items = deliverablesForPlan(planId)

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{ background: `${color}0c`, border: `1px solid ${color}28` }}
    >
      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color }}>
        Qué incluye este plan (verificable)
      </p>
      <ul className="space-y-2">
        {items.map(d => (
          <li key={d.id} className="flex gap-2 text-[11px] leading-snug">
            <span className="shrink-0 w-4 text-center" aria-hidden>
              {d.inApp ? '✓' : '○'}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-white/75">{d.label}</span>
              <span className="text-white/35 ml-1">· {channelLabel(d.channel)}</span>
              {d.note && <p className="text-white/30 text-[10px] mt-0.5">{d.note}</p>}
              {d.inApp && d.previewHref && (
                <Link
                  href={d.previewHref}
                  className="inline-block mt-1 text-[10px] font-bold underline"
                  style={{ color }}
                >
                  Ver en la app
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[9px] text-white/30 pt-1 border-t border-white/[0.06]">
        ✓ = visible en la PWA · ○ = radio o gestión comercial (no es pantalla de la app)
      </p>
    </div>
  )
}
