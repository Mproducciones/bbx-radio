import { NextResponse } from 'next/server'
import { plansForCheckout } from '@/lib/bbxSubscriptionPlans'
import { isMercadoPagoConfigured } from '@/lib/mercadoPagoBilling'
import { isStripeConfigured } from '@/lib/stripeBilling'

export async function GET() {
  return NextResponse.json({
    plans: plansForCheckout(),
    providers: {
      mercadoPago: isMercadoPagoConfigured(),
      stripe: isStripeConfigured(),
    },
    graceDays: Number(process.env.SUBSCRIPTION_GRACE_DAYS ?? 7),
    defaultPlan: 'pro',
  })
}
