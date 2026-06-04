import Stripe from 'stripe'
import { getTenantId, markPaymentReceived, upsertTenantSubscription } from '@/lib/subscription'
import { supabaseAdmin } from '@/lib/supabase'
import { CURRENT_PLAN } from '@/lib/plan'

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID)
}

export async function createCheckoutSession(opts: {
  origin: string
  billingEmail?: string
}): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe()
  const priceId = process.env.STRIPE_PRICE_ID
  if (!stripe || !priceId) {
    return { error: 'Stripe no configurado en este deploy' }
  }

  const tenantId = getTenantId()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${opts.origin}/bbx-admin?billing=success`,
    cancel_url: `${opts.origin}/suspended?billing=cancelled`,
    customer_email: opts.billingEmail,
    metadata: { tenant_id: tenantId, plan: CURRENT_PLAN },
    subscription_data: {
      metadata: { tenant_id: tenantId, plan: CURRENT_PLAN },
    },
  })

  if (!session.url) return { error: 'No se pudo crear sesión de pago' }
  return { url: session.url }
}

export async function createBillingPortalSession(opts: {
  origin: string
  stripeCustomerId: string
}): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe()
  if (!stripe) return { error: 'Stripe no configurado' }

  const session = await stripe.billingPortal.sessions.create({
    customer: opts.stripeCustomerId,
    return_url: `${opts.origin}/admin`,
  })

  return { url: session.url }
}

export async function handleStripeWebhook(
  payload: string,
  signature: string,
): Promise<{ ok: boolean; error?: string }> {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return { ok: false, error: 'Stripe webhook no configurado' }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (e) {
    return { ok: false, error: `Webhook signature: ${e instanceof Error ? e.message : 'invalid'}` }
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const tenantId = session.metadata?.tenant_id ?? getTenantId()
      const plan = session.metadata?.plan ?? CURRENT_PLAN
      await markPaymentReceived({
        tenantId,
        plan,
        billingEmail: session.customer_email ?? undefined,
      })
      if (session.customer && typeof session.customer === 'string') {
        await supabaseAdmin
          .from('tenant_subscriptions')
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
            updated_at: new Date().toISOString(),
          })
          .eq('tenant_id', tenantId)
      }
      break
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const subMeta = invoice.parent?.subscription_details?.metadata
      const tenantId = invoice.metadata?.tenant_id
        ?? subMeta?.tenant_id
        ?? getTenantId()
      await markPaymentReceived({
        tenantId,
        billingEmail: invoice.customer_email ?? undefined,
        notes: `Pago automático Stripe · ${invoice.id}`,
      })
      break
    }
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      const obj = event.data.object as { metadata?: { tenant_id?: string } }
      const tenantId = obj.metadata?.tenant_id ?? getTenantId()
      await upsertTenantSubscription({
        tenant_id: tenantId,
        status: 'grace',
        notes: `Stripe: ${event.type} · ${new Date().toISOString()}`,
      })
      break
    }
    default:
      break
  }

  return { ok: true }
}
