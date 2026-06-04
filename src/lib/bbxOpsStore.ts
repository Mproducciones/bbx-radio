import { supabaseAdmin } from '@/lib/supabase'
import type { OpsAlert, OpsAlertRow } from '@/lib/bbxOpsTypes'

function rowToAlert(row: Record<string, unknown>): OpsAlertRow {
  return {
    id: String(row.id),
    tenantId: row.tenant_id ? String(row.tenant_id) : null,
    severity: row.severity as OpsAlertRow['severity'],
    category: row.category as OpsAlertRow['category'],
    title: String(row.title),
    message: String(row.message),
    actionUrl: row.action_url ? String(row.action_url) : undefined,
    dedupeKey: String(row.dedupe_key),
    acknowledgedAt: row.acknowledged_at ? String(row.acknowledged_at) : null,
    lastNotifiedAt: row.last_notified_at ? String(row.last_notified_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

let opsTableMissing = false

export function isOpsTableAvailable(): boolean {
  return !opsTableMissing
}

export async function syncOpsAlerts(alerts: OpsAlert[]): Promise<{
  open: OpsAlertRow[]
  tableAvailable: boolean
}> {
  if (opsTableMissing) {
    return { open: [], tableAvailable: false }
  }

  const now = new Date().toISOString()
  const activeKeys = new Set(alerts.map(a => a.dedupeKey))

  for (const a of alerts) {
    const { data: existing } = await supabaseAdmin
      .from('bbx_ops_alerts')
      .select('acknowledged_at')
      .eq('dedupe_key', a.dedupeKey)
      .maybeSingle()

    const { error } = await supabaseAdmin.from('bbx_ops_alerts').upsert(
      {
        tenant_id: a.tenantId,
        severity: a.severity,
        category: a.category,
        title: a.title,
        message: a.message,
        action_url: a.actionUrl ?? null,
        dedupe_key: a.dedupeKey,
        updated_at: now,
        acknowledged_at: existing?.acknowledged_at ?? null,
      },
      { onConflict: 'dedupe_key' },
    )

    if (error) {
      if (error.message.includes('bbx_ops_alerts') || error.code === '42P01') {
        opsTableMissing = true
        return { open: [], tableAvailable: false }
      }
    }
  }

  const { data: openRows, error: listErr } = await supabaseAdmin
    .from('bbx_ops_alerts')
    .select('*')
    .is('acknowledged_at', null)
    .order('updated_at', { ascending: false })
    .limit(100)

  if (listErr) {
    if (listErr.message.includes('bbx_ops_alerts') || listErr.code === '42P01') {
      opsTableMissing = true
    }
    return { open: [], tableAvailable: false }
  }

  for (const row of openRows ?? []) {
    const key = String(row.dedupe_key)
    if (!activeKeys.has(key)) {
      await supabaseAdmin
        .from('bbx_ops_alerts')
        .update({ acknowledged_at: now, updated_at: now })
        .eq('id', row.id)
    }
  }

  const open = (openRows ?? [])
    .filter(r => activeKeys.has(String(r.dedupe_key)))
    .map(r => rowToAlert(r as Record<string, unknown>))

  return { open, tableAvailable: true }
}

export async function listOpenOpsAlerts(): Promise<OpsAlertRow[]> {
  if (opsTableMissing) return []

  const { data, error } = await supabaseAdmin
    .from('bbx_ops_alerts')
    .select('*')
    .is('acknowledged_at', null)
    .order('updated_at', { ascending: false })
    .limit(100)

  if (error) {
    if (error.message.includes('bbx_ops_alerts') || error.code === '42P01') {
      opsTableMissing = true
    }
    return []
  }

  return (data ?? []).map(r => rowToAlert(r as Record<string, unknown>))
}

export async function acknowledgeOpsAlert(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('bbx_ops_alerts')
    .update({ acknowledged_at: new Date().toISOString() })
    .eq('id', id)

  return !error
}

export async function markOpsAlertNotified(id: string): Promise<void> {
  await supabaseAdmin
    .from('bbx_ops_alerts')
    .update({ last_notified_at: new Date().toISOString() })
    .eq('id', id)
}
