import { NextResponse, type NextRequest } from 'next/server'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripeBilling'
import { getSubscriptionRecord } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Pagos automáticos no disponibles. Contacta a BBX.' }, { status: 503 })
  }

  const sub = await getSubscriptionRecord()
  const body = await req.json().catch(() => ({}))
  const billingEmail = typeof body.email === 'string' ? body.email : sub.billingEmail ?? undefined

  const result = await createCheckoutSession({
    origin: req.nextUrl.origin,
    billingEmail,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url })
}
