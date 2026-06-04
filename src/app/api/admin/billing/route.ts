import { NextResponse, type NextRequest } from 'next/server'
import { isSuperAdminRequestAuthorized } from '@/lib/adminAuth'
import {
  getSubscriptionRecordForTenant,
  getTenantId,
  listAllTenantSubscriptions,
  markPaymentReceived,
  suspendTenant,
  upsertTenantSubscription,
} from '@/lib/subscription'

export async function GET(req: NextRequest) {
  if (!(await isSuperAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const tenants = await listAllTenantSubscriptions()
  const currentTenantId = getTenantId()
  return NextResponse.json({ tenants, currentTenantId })
}

export async function PATCH(req: NextRequest) {
  if (!(await isSuperAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.action) {
    return NextResponse.json({ error: 'action requerida' }, { status: 400 })
  }

  const tenantId = body.tenantId ? String(body.tenantId) : getTenantId()

  switch (body.action) {
    case 'mark_paid': {
      const billingCycle = body.billingCycle === 'annual' ? 'annual' : 'monthly'
      const result = await markPaymentReceived({
        tenantId,
        plan: body.plan ? String(body.plan) : undefined,
        billingEmail: body.billingEmail ? String(body.billingEmail) : undefined,
        amountClp: body.amountClp ? Number(body.amountClp) : undefined,
        billingCycle,
        notes: body.notes
          ? String(body.notes)
          : `Pago manual (${billingCycle === 'annual' ? 'anual' : 'mensual'}) desde panel BBX`,
      })
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
      break
    }
    case 'suspend': {
      const result = await suspendTenant(tenantId, body.notes ? String(body.notes) : undefined)
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
      break
    }
    case 'activate': {
      const result = await upsertTenantSubscription({
        tenant_id: tenantId,
        status: 'active',
        notes: body.notes ? String(body.notes) : 'Reactivado manualmente',
      })
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
      break
    }
    case 'set_grace': {
      const result = await upsertTenantSubscription({
        tenant_id: tenantId,
        status: 'grace',
        notes: body.notes ? String(body.notes) : 'Gracia manual',
      })
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
      break
    }
    case 'set_trial': {
      const days = Number(body.trialDays ?? 14)
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + days)
      const result = await upsertTenantSubscription({
        tenant_id: tenantId,
        status: 'trial',
        trial_ends_at: trialEnd.toISOString(),
        plan: body.plan ? String(body.plan) : undefined,
        notes: body.notes ? String(body.notes) : `Trial ${days} días`,
      })
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
      break
    }
    default:
      return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  }

  const subscription = await getSubscriptionRecordForTenant(tenantId)
  const tenants = await listAllTenantSubscriptions()
  return NextResponse.json({ ok: true, subscription, tenants })
}
