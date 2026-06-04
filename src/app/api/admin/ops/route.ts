import { NextResponse, type NextRequest } from 'next/server'
import { isSuperAdminRequestAuthorized } from '@/lib/adminAuth'
import { runOpsChecks } from '@/lib/bbxOpsMonitor'
import { syncOpsAlerts, acknowledgeOpsAlert, isOpsTableAvailable } from '@/lib/bbxOpsStore'
import {
  getOpsNotifyConfig,
  runOpsNotifyPipeline,
  sendOpsNotification,
  opsWhatsAppDigestUrl,
} from '@/lib/bbxOpsNotify'
import type { OpsAlert } from '@/lib/bbxOpsTypes'

async function buildOpsPayload() {
  const scanned = await runOpsChecks()
  const { open, tableAvailable } = await syncOpsAlerts(scanned)
  const alerts = tableAvailable ? open : scanned.map((a, i) => ({
    ...a,
    id: `live-${i}`,
    acknowledgedAt: null,
    lastNotifiedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  const critical = alerts.filter(a => a.severity === 'critical').length
  const warning = alerts.filter(a => a.severity === 'warning').length
  const info = alerts.filter(a => a.severity === 'info').length

  return {
    alerts,
    summary: { critical, warning, info, total: alerts.length },
    scannedAt: new Date().toISOString(),
    tableAvailable: tableAvailable && isOpsTableAvailable(),
    config: getOpsNotifyConfig(),
    whatsappDigestUrl: opsWhatsAppDigestUrl(scanned),
  }
}

export async function GET(req: NextRequest) {
  if (!(await isSuperAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(await buildOpsPayload())
}

export async function POST(req: NextRequest) {
  if (!(await isSuperAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const action = typeof body.action === 'string' ? body.action : 'refresh'

  if (action === 'ack' && body.alertId) {
    await acknowledgeOpsAlert(String(body.alertId))
    return NextResponse.json(await buildOpsPayload())
  }

  if (action === 'test_notify') {
    const test: OpsAlert = {
      tenantId: null,
      severity: 'warning',
      category: 'infrastructure',
      title: 'Prueba BBX Ops',
      message: 'Si ves esto, las notificaciones están configuradas.',
      dedupeKey: `test:${Date.now()}`,
    }
    const results = await sendOpsNotification(test)
    const config = getOpsNotifyConfig()
    return NextResponse.json({ ok: true, results, config })
  }

  if (action === 'notify_now') {
    const payload = await buildOpsPayload()
    const toNotify = payload.alerts.filter(
      a => a.severity === 'critical' || a.severity === 'warning',
    )
    const { notified, results } = await runOpsNotifyPipeline(
      toNotify.map(a => ({
        ...a,
        dedupeKey: a.dedupeKey,
      })),
    )
    return NextResponse.json({ ...payload, notified, notifyResults: results })
  }

  return NextResponse.json(await buildOpsPayload())
}
