import { getSubscriptionRecord, isGrace } from '@/lib/subscription'
import { SubscriptionGraceBannerClient } from '@/components/billing/SubscriptionGraceBannerClient'

export async function SubscriptionGraceBanner() {
  const sub = await getSubscriptionRecord()
  if (!isGrace(sub.status)) return null

  return (
    <SubscriptionGraceBannerClient
      reason={sub.reason}
      daysRemaining={sub.daysRemaining}
    />
  )
}
