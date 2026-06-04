'use client'

import { BillingPayChooser } from '@/components/billing/BillingPayChooser'

export function SuspendedPayActions({
  billingEmail,
  currentPlan,
}: {
  billingEmail: string | null
  currentPlan?: string
}) {
  return <BillingPayChooser billingEmail={billingEmail} currentPlan={currentPlan} />
}
