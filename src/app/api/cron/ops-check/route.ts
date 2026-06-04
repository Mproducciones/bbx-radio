import { NextResponse, type NextRequest } from 'next/server'
import { runOpsChecks } from '@/lib/bbxOpsMonitor'
import { syncOpsAlerts } from '@/lib/bbxOpsStore'
import { runOpsNotifyPipeline } from '@/lib/bbxOpsNotify'

function authorizeCron(req: NextRequest): boolean {
  const secret = process.env.BBX_OPS_CRON_SECRET?.trim()
  if (!secret) return false
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const scanned = await runOpsChecks()
  const { open, tableAvailable } = await syncOpsAlerts(scanned)

  const toNotify = open.filter(a => a.severity === 'critical' || a.severity === 'warning')
  const { notified, results } = tableAvailable
    ? await runOpsNotifyPipeline(toNotify)
    : { notified: 0, results: [] }

  return NextResponse.json({
    ok: true,
    scanned: scanned.length,
    open: open.length,
    notified,
    tableAvailable,
    results,
    at: new Date().toISOString(),
  })
}
