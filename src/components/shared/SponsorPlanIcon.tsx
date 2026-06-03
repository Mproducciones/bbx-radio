'use client'

import { Award, Radio, Sparkles, type LucideIcon } from 'lucide-react'
import type { SponsorPlanId } from '@/lib/sponsorPlans'

const ICONS: Record<SponsorPlanId, LucideIcon> = {
  basico: Radio,
  premium: Sparkles,
  empresarial: Award,
}

export function SponsorPlanIcon({
  planId,
  className = 'w-5 h-5',
  strokeWidth = 2,
}: {
  planId: SponsorPlanId | string
  className?: string
  strokeWidth?: number
}) {
  const Icon = ICONS[planId as SponsorPlanId] ?? Radio
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />
}
