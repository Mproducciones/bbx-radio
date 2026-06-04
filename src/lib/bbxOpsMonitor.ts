import { supabaseAdmin } from '@/lib/supabase'
import { listAllTenantSubscriptions, getTenantId, getSubscriptionRecordForTenant } from '@/lib/subscription'
import type { OpsAlert } from '@/lib/bbxOpsTypes'

const EXPIRE_WARN_DAYS = 3
const EXPIRE_INFO_DAYS = 7
const PENDING_SONGS_WARN = 15

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const end = new Date(iso)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / 86_400_000)
}

function subscriptionAlerts(
  tenantId: string,
  status: string,
  reason: string | null,
  periodEnd: string | null,
  daysRemaining: number | null,
): OpsAlert[] {
  const alerts: OpsAlert[] = []
  const base = { tenantId, category: 'subscription' as const }

  if (status === 'suspended') {
    alerts.push({
      ...base,
      severity: 'critical',
      title: `Radio suspendida: ${tenantId}`,
      message: reason ?? 'Suscripción vencida o suspendida. La app pública está caída.',
      actionUrl: '/bbx-admin',
      dedupeKey: `sub:suspended:${tenantId}`,
    })
  }

  if (status === 'grace') {
    alerts.push({
      ...base,
      severity: 'warning',
      title: `Gracia de pago: ${tenantId}`,
      message: reason ?? 'Pago pendiente. Regularizar antes de que corte la app.',
      actionUrl: '/bbx-admin',
      dedupeKey: `sub:grace:${tenantId}`,
    })
  }

  const days = daysRemaining ?? daysUntil(periodEnd)
  if (status === 'active' || status === 'trial') {
    if (days != null && days <= EXPIRE_WARN_DAYS && days >= 0) {
      alerts.push({
        ...base,
        severity: 'warning',
        title: `Vence pronto: ${tenantId}`,
        message: `Quedan ${days} día${days !== 1 ? 's' : ''} de periodo. Contactar para renovación.`,
        actionUrl: '/bbx-admin',
        dedupeKey: `sub:expire-soon:${tenantId}`,
      })
    } else if (days != null && days <= EXPIRE_INFO_DAYS && days > EXPIRE_WARN_DAYS) {
      alerts.push({
        ...base,
        severity: 'info',
        title: `Renovación en ${days} días: ${tenantId}`,
        message: 'Buen momento para ofrecer plan anual o confirmar transferencia.',
        actionUrl: '/bbx-admin',
        dedupeKey: `sub:expire-info:${tenantId}`,
      })
    }
  }

  return alerts
}

async function engagementAlertsForTenant(tenantId: string): Promise<OpsAlert[]> {
  if (tenantId !== getTenantId()) return []

  const alerts: OpsAlert[] = []

  try {
    const { count, error } = await supabaseAdmin
      .from('song_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (!error && count != null && count >= PENDING_SONGS_WARN) {
      alerts.push({
        tenantId,
        severity: 'warning',
        category: 'engagement',
        title: 'Cola de pedidos de tema',
        message: `${count} solicitudes sin revisar en cabina. Revisar panel admin.`,
        actionUrl: '/admin',
        dedupeKey: `eng:pending-songs:${tenantId}`,
      })
    }
  } catch {
    /* tabla opcional */
  }

  try {
    const { count, error } = await supabaseAdmin
      .from('saludos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (!error && count != null && count >= 10) {
      alerts.push({
        tenantId,
        severity: 'info',
        category: 'engagement',
        title: 'Saludos pendientes',
        message: `${count} saludos esperando en cabina.`,
        actionUrl: '/admin',
        dedupeKey: `eng:pending-saludos:${tenantId}`,
      })
    }
  } catch {
    /* tabla opcional */
  }

  return alerts
}

function infrastructureAlerts(): OpsAlert[] {
  const alerts: OpsAlert[] = []
  const tenantId = getTenantId()

  if (!process.env.SUPABASE_SERVICE_KEY) {
    alerts.push({
      tenantId,
      severity: 'critical',
      category: 'infrastructure',
      title: 'Supabase service key ausente',
      message: 'Falta SUPABASE_SERVICE_KEY en el deploy. APIs de admin pueden fallar.',
      dedupeKey: 'infra:missing-service-key',
    })
  }

  if (!process.env.ADMIN_SESSION_SECRET) {
    alerts.push({
      tenantId,
      severity: 'warning',
      category: 'infrastructure',
      title: 'Sesión admin no configurada',
      message: 'Falta ADMIN_SESSION_SECRET en variables de entorno.',
      dedupeKey: 'infra:missing-admin-secret',
    })
  }

  return alerts
}

/** Escaneo completo — suscripciones, engagement e infra del deploy actual. */
export async function runOpsChecks(): Promise<OpsAlert[]> {
  const alerts: OpsAlert[] = [...infrastructureAlerts()]

  const tenants = await listAllTenantSubscriptions()
  const seen = new Set<string>()

  for (const t of tenants) {
    seen.add(t.tenantId)
    alerts.push(
      ...subscriptionAlerts(t.tenantId, t.status, t.reason, t.currentPeriodEnd, t.daysRemaining),
    )
    alerts.push(...(await engagementAlertsForTenant(t.tenantId)))
  }

  const currentId = getTenantId()
  if (!seen.has(currentId)) {
    const t = await getSubscriptionRecordForTenant(currentId)
    alerts.push(
      ...subscriptionAlerts(t.tenantId, t.status, t.reason, t.currentPeriodEnd, t.daysRemaining),
    )
    alerts.push(...(await engagementAlertsForTenant(currentId)))
  }

  const order = { critical: 0, warning: 1, info: 2 }
  return alerts.sort((a, b) => order[a.severity] - order[b.severity])
}
