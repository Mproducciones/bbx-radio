import { NextResponse, type NextRequest } from 'next/server'
import { createBillingPortalSession, isStripeConfigured } from '@/lib/stripeBilling'
import { getSubscriptionRecord } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Portal de facturación no disponible' }, { status: 503 })
  }

  const sub = await getSubscriptionRecord()
  if (!sub.stripeCustomerId) {
    return NextResponse.json({ error: 'Sin cliente Stripe vinculado' }, { status: 400 })
  }

  const result = await createBillingPortalSession({
    origin: req.nextUrl.origin,
    stripeCustomerId: sub.stripeCustomerId,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url })
}
