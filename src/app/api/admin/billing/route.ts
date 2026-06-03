import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import {
  getSubscriptionRecord,
  getTenantId,
  markPaymentReceived,
  suspendTenant,
  upsertTenantSubscription,
} from '@/lib/subscription'

export async function GET(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sub = await getSubscriptionRecord()
  return NextResponse.json({ ...sub, tenantId: getTenantId() })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.action) {
    return NextResponse.json({ error: 'action requerida' }, { status: 400 })
  }

  const tenantId = getTenantId()

  switch (body.action) {
    case 'mark_paid': {
      const result = await markPaymentReceived({
        tenantId,
        plan: body.plan ? String(body.plan) : undefined,
        billingEmail: body.billingEmail ? String(body.billingEmail) : undefined,
        amountClp: body.amountClp ? Number(body.amountClp) : undefined,
        notes: body.notes ? String(body.notes) : 'Pago registrado manualmente desde panel',
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

  const sub = await getSubscriptionRecord()
  return NextResponse.json({ ok: true, subscription: sub })
}
