import { NextResponse, type NextRequest } from 'next/server'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripeBilling'
import { createMercadoPagoCheckout, isMercadoPagoConfigured } from '@/lib/mercadoPagoBilling'
import { getSubscriptionRecord } from '@/lib/subscription'
import {
  BBX_BILLING_DEFAULT_PLAN,
  type BillingCycle,
  type BbxSubscriptionPlanId,
} from '@/lib/bbxSubscriptionPlans'

function parsePlanId(v: unknown): BbxSubscriptionPlanId {
  if (v === 'esencial' || v === 'pro' || v === 'premium') return v
  return BBX_BILLING_DEFAULT_PLAN
}

function parseCycle(v: unknown): BillingCycle {
  return v === 'annual' ? 'annual' : 'monthly'
}

export async function POST(req: NextRequest) {
  const sub = await getSubscriptionRecord()
  const body = await req.json().catch(() => ({}))
  const billingEmail = typeof body.email === 'string' ? body.email : sub.billingEmail ?? undefined
  const planId = parsePlanId(body.plan)
  const cycle = parseCycle(body.cycle)
  const preferMp = body.provider === 'mercadopago' || body.provider === 'mp'

  if (preferMp && isMercadoPagoConfigured()) {
    const mp = await createMercadoPagoCheckout({
      origin: req.nextUrl.origin,
      tenantId: sub.tenantId,
      planId,
      cycle,
      billingEmail,
    })
    if ('url' in mp) return NextResponse.json({ url: mp.url, provider: 'mercadopago', planId, cycle })
    return NextResponse.json({ error: mp.error }, { status: 503 })
  }

  if (isMercadoPagoConfigured() && !isStripeConfigured()) {
    const mp = await createMercadoPagoCheckout({
      origin: req.nextUrl.origin,
      tenantId: sub.tenantId,
      planId,
      cycle,
      billingEmail,
    })
    if ('url' in mp) return NextResponse.json({ url: mp.url, provider: 'mercadopago', planId, cycle })
    return NextResponse.json(
      { error: mp.error ?? 'Mercado Pago en configuración. Usa transferencia o WhatsApp BBX.' },
      { status: 503 },
    )
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: 'Pagos en línea en configuración. Usa transferencia o WhatsApp BBX.',
        planId,
        cycle,
        mercadoPagoPending: !isMercadoPagoConfigured(),
      },
      { status: 503 },
    )
  }

  const result = await createCheckoutSession({
    origin: req.nextUrl.origin,
    billingEmail,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, provider: 'stripe', planId, cycle })
}
