import { supabaseAdmin } from '@/lib/supabase'
import { RADIO } from '@/lib/radioConfig'
import { CURRENT_PLAN } from '@/lib/plan'
import {
  amountForPlan,
  periodDaysForCycle,
  type BillingCycle,
  type BbxSubscriptionPlanId,
} from '@/lib/bbxSubscriptionPlans'

export type SubscriptionStatus = 'active' | 'grace' | 'suspended' | 'trial'

export interface SubscriptionRecord {
  tenantId: string
  status: SubscriptionStatus
  plan: string
  currentPeriodEnd: string | null
  graceDays: number
  lastPaymentAt: string | null
  billingEmail: string | null
  stripeCustomerId: string | null
  notes: string | null
  /** Días restantes en periodo o gracia */
  daysRemaining: number | null
  /** Motivo legible para UI */
  reason: string | null
}

export interface TenantSubscriptionRow {
  tenant_id: string
  status: string
  plan: string
  current_period_start: string | null
  current_period_end: string | null
  trial_ends_at: string | null
  grace_days: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  last_payment_at: string | null
  amount_clp: number | null
  billing_email: string | null
  notes: string | null
}

const DEFAULT_GRACE_DAYS = Number(process.env.SUBSCRIPTION_GRACE_DAYS ?? 7)

export function getTenantId(): string {
  return process.env.TENANT_ID
    ?? process.env.NEXT_PUBLIC_TENANT_ID
    ?? RADIO.id
}

function envOverride(): SubscriptionStatus | null {
  const raw = process.env.SUBSCRIPTION_STATUS?.trim().toLowerCase()
  if (raw === 'active' || raw === 'grace' || raw === 'suspended' || raw === 'trial') {
    return raw
  }
  return null
}

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / 86_400_000)
}

function computeEffectiveStatus(row: TenantSubscriptionRow): {
  status: SubscriptionStatus
  reason: string | null
  daysRemaining: number | null
} {
  const now = new Date()

  if (row.status === 'suspended' || row.status === 'cancelled') {
    return { status: 'suspended', reason: 'Cuenta suspendida por falta de pago.', daysRemaining: null }
  }

  if (row.status === 'trial' && row.trial_ends_at) {
    const trialEnd = new Date(row.trial_ends_at)
    if (now <= trialEnd) {
      return {
        status: 'trial',
        reason: 'Periodo de prueba activo.',
        daysRemaining: daysBetween(now, trialEnd),
      }
    }
    return { status: 'suspended', reason: 'Periodo de prueba finalizado.', daysRemaining: null }
  }

  if (row.current_period_end) {
    const periodEnd = new Date(row.current_period_end)
    const graceEnd = new Date(periodEnd)
    graceEnd.setDate(graceEnd.getDate() + (row.grace_days ?? DEFAULT_GRACE_DAYS))

    if (now > graceEnd) {
      return {
        status: 'suspended',
        reason: `Pago vencido desde ${periodEnd.toLocaleDateString('es-CL')}.`,
        daysRemaining: null,
      }
    }
    if (now > periodEnd) {
      return {
        status: 'grace',
        reason: `Gracia hasta ${graceEnd.toLocaleDateString('es-CL')}. Regulariza el pago.`,
        daysRemaining: daysBetween(now, graceEnd),
      }
    }
    return {
      status: 'active',
      reason: null,
      daysRemaining: daysBetween(now, periodEnd),
    }
  }

  if (row.status === 'grace') {
    return { status: 'grace', reason: 'Pago pendiente de confirmación.', daysRemaining: null }
  }

  return { status: 'active', reason: null, daysRemaining: null }
}

function rowToRecord(row: TenantSubscriptionRow): SubscriptionRecord {
  const { status, reason, daysRemaining } = computeEffectiveStatus(row)
  return {
    tenantId: row.tenant_id,
    status,
    plan: row.plan,
    currentPeriodEnd: row.current_period_end,
    graceDays: row.grace_days ?? DEFAULT_GRACE_DAYS,
    lastPaymentAt: row.last_payment_at,
    billingEmail: row.billing_email,
    stripeCustomerId: row.stripe_customer_id,
    notes: row.notes,
    daysRemaining,
    reason,
  }
}

function defaultActiveRecord(): SubscriptionRecord {
  return {
    tenantId: getTenantId(),
    status: 'active',
    plan: CURRENT_PLAN,
    currentPeriodEnd: null,
    graceDays: DEFAULT_GRACE_DAYS,
    lastPaymentAt: null,
    billingEmail: null,
    stripeCustomerId: null,
    notes: null,
    daysRemaining: null,
    reason: null,
  }
}

export async function getSubscriptionRecordForTenant(tenantId: string): Promise<SubscriptionRecord> {
  const override = envOverride()
  if (override && tenantId === getTenantId()) {
    return {
      ...defaultActiveRecord(),
      tenantId,
      status: override,
      reason: override === 'suspended'
        ? 'Suspendido manualmente (variable de entorno).'
        : override === 'grace'
          ? 'Gracia manual (variable de entorno).'
          : null,
    }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('tenant_subscriptions')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle()

    if (error || !data) return { ...defaultActiveRecord(), tenantId }
    return rowToRecord(data as TenantSubscriptionRow)
  } catch {
    return { ...defaultActiveRecord(), tenantId }
  }
}

export async function getSubscriptionRecord(): Promise<SubscriptionRecord> {
  return getSubscriptionRecordForTenant(getTenantId())
}

export async function listAllTenantSubscriptions(): Promise<SubscriptionRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tenant_subscriptions')
      .select('*')
      .order('tenant_id')

    if (error || !data?.length) {
      return [await getSubscriptionRecord()]
    }

    return (data as TenantSubscriptionRow[]).map(rowToRecord)
  } catch {
    return [await getSubscriptionRecord()]
  }
}

export function isAppAccessible(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'grace' || status === 'trial'
}

export function isSuspended(status: SubscriptionStatus): boolean {
  return status === 'suspended'
}

export function isGrace(status: SubscriptionStatus): boolean {
  return status === 'grace'
}

/** Rutas permitidas cuando la app está suspendida */
export function isRouteAllowedWhenSuspended(pathname: string): boolean {
  if (pathname === '/suspended') return true
  if (pathname.startsWith('/admin')) return true
  if (pathname.startsWith('/bbx-admin')) return true
  if (pathname.startsWith('/api/admin/billing')) return true
  if (pathname.startsWith('/api/admin/ops')) return true
  if (pathname.startsWith('/api/admin/login')) return true
  if (pathname.startsWith('/api/admin/me')) return true
  if (pathname.startsWith('/api/admin/logout')) return true
  if (pathname.startsWith('/api/billing/')) return true
  if (pathname.startsWith('/_next')) return true
  if (pathname.startsWith('/icons')) return true
  if (pathname === '/manifest.json' || pathname === '/sw.js' || pathname === '/favicon.ico') return true
  if (/\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(pathname)) return true
  return false
}

export async function upsertTenantSubscription(
  patch: Partial<TenantSubscriptionRow> & { tenant_id: string },
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('tenant_subscriptions')
    .upsert({ ...patch, updated_at: new Date().toISOString() }, { onConflict: 'tenant_id' })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/** Marca pago recibido — extiende periodo según ciclo (30 d mensual / 365 d anual) */
export async function markPaymentReceived(opts: {
  tenantId?: string
  plan?: string
  billingEmail?: string
  amountClp?: number
  notes?: string
  billingCycle?: BillingCycle
}): Promise<{ ok: boolean; error?: string }> {
  const tenantId = opts.tenantId ?? getTenantId()
  const cycle = opts.billingCycle ?? 'monthly'
  const planId = (opts.plan ?? CURRENT_PLAN) as BbxSubscriptionPlanId
  const now = new Date()
  const periodEnd = new Date(now)
  periodEnd.setDate(periodEnd.getDate() + periodDaysForCycle(cycle))

  const amount =
    opts.amountClp ??
    amountForPlan(planId, cycle)

  const cycleNote = cycle === 'annual' ? ' · plan anual' : ' · plan mensual'

  return upsertTenantSubscription({
    tenant_id: tenantId,
    status: 'active',
    plan: planId,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    last_payment_at: now.toISOString(),
    billing_email: opts.billingEmail ?? undefined,
    amount_clp: amount,
    notes: opts.notes ?? `Pago registrado${cycleNote}`,
  })
}

export async function suspendTenant(tenantId?: string, notes?: string) {
  return upsertTenantSubscription({
    tenant_id: tenantId ?? getTenantId(),
    status: 'suspended',
    notes: notes ?? 'Suspendido manualmente desde panel BBX',
  })
}
