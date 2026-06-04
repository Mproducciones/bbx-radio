/**
 * Integración Mercado Pago — preparada, sin activar hasta configurar env.
 *
 * Variables esperadas (ver ENV_SETUP.md):
 *   MERCADOPAGO_ACCESS_TOKEN
 *   MERCADOPAGO_WEBHOOK_SECRET (opcional, validación firma)
 *   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY (Checkout Pro / Brick)
 */

import type { BillingCycle, BbxSubscriptionPlanId } from '@/lib/bbxSubscriptionPlans'
import { amountForPlan } from '@/lib/bbxSubscriptionPlans'

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim())
}

export type MercadoPagoCheckoutInput = {
  origin: string
  tenantId: string
  planId: BbxSubscriptionPlanId
  cycle: BillingCycle
  billingEmail?: string
}

/** Stub: implementar Preference / Preapproval cuando actives MP */
export async function createMercadoPagoCheckout(
  _opts: MercadoPagoCheckoutInput,
): Promise<{ url: string } | { error: string }> {
  if (!isMercadoPagoConfigured()) {
    return { error: 'Mercado Pago no configurado' }
  }
  return { error: 'Integración MP pendiente de activación' }
}

export function mercadoPagoAmountClp(planId: BbxSubscriptionPlanId, cycle: BillingCycle): number {
  return amountForPlan(planId, cycle)
}

/** Stub webhook — mapear payment.approved → markPaymentReceived */
export async function handleMercadoPagoWebhook(
  _payload: string,
  _headers: Headers,
): Promise<{ ok: boolean; error?: string }> {
  return { ok: false, error: 'Webhook MP no implementado' }
}
