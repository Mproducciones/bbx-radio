import { NextResponse } from 'next/server'
import { getSubscriptionRecord } from '@/lib/subscription'

export async function GET() {
  const sub = await getSubscriptionRecord()
  return NextResponse.json({
    status: sub.status,
    plan: sub.plan,
    currentPeriodEnd: sub.currentPeriodEnd,
    daysRemaining: sub.daysRemaining,
    reason: sub.reason,
    stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
  })
}
