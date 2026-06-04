import { BBX_CONTACT, bbxWhatsApp } from '@/lib/bbxContent'
import type { OpsAlert, OpsAlertRow, OpsNotifyResult } from '@/lib/bbxOpsTypes'

const NOTIFY_COOLDOWN_MS = 6 * 60 * 60 * 1000

export function getOpsNotifyConfig() {
  const webhookUrl = process.env.BBX_OPS_WEBHOOK_URL?.trim() || null
  let ntfyTopic: string | null = null
  if (webhookUrl) {
    try {
      const u = new URL(webhookUrl)
      if (u.hostname.includes('ntfy.sh')) {
        ntfyTopic = u.pathname.replace(/^\//, '') || null
      }
    } catch {
      ntfyTopic = null
    }
  }

  return {
    webhookUrl,
    ntfyTopic,
    notifyPhone: process.env.BBX_OPS_NOTIFY_PHONE?.trim() || BBX_CONTACT.phone,
    cronEnabled: Boolean(process.env.BBX_OPS_CRON_SECRET?.trim()),
    channels: {
      webhook: Boolean(webhookUrl),
      whatsappManual: true,
      sms: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    },
  }
}

function shouldNotifyAgain(alert: OpsAlertRow): boolean {
  if (alert.severity === 'critical') return true
  if (!alert.lastNotifiedAt) return true
  const last = new Date(alert.lastNotifiedAt).getTime()
  return Date.now() - last > NOTIFY_COOLDOWN_MS
}

async function notifyWebhook(alert: OpsAlert): Promise<OpsNotifyResult> {
  const url = process.env.BBX_OPS_WEBHOOK_URL?.trim()
  if (!url) return { channel: 'webhook', ok: false, skipped: true }

  try {
    const isNtfy = url.includes('ntfy.sh')
    const res = await fetch(url, {
      method: 'POST',
      headers: isNtfy
        ? {
            Title: `[BBX] ${alert.title}`,
            Priority: alert.severity === 'critical' ? 'urgent' : alert.severity === 'warning' ? 'high' : 'default',
            Tags: `${alert.category},${alert.severity}`,
          }
        : { 'Content-Type': 'application/json' },
      body: isNtfy
        ? `${alert.message}${alert.tenantId ? `\n\nRadio: ${alert.tenantId}` : ''}`
        : JSON.stringify({
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
            category: alert.category,
            tenantId: alert.tenantId,
            actionUrl: alert.actionUrl,
          }),
    })

    if (!res.ok) {
      return { channel: 'webhook', ok: false, error: `HTTP ${res.status}` }
    }
    return { channel: 'webhook', ok: true }
  } catch (e) {
    return { channel: 'webhook', ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

async function notifyTwilioSms(alert: OpsAlert): Promise<OpsNotifyResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_SMS_FROM
  const to = process.env.BBX_OPS_NOTIFY_PHONE || process.env.TWILIO_SMS_TO

  if (!sid || !token || !from || !to) {
    return { channel: 'sms', ok: false, skipped: true }
  }

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString('base64')
    const body = `[BBX ${alert.severity}] ${alert.title}: ${alert.message}`.slice(0, 1500)
    const params = new URLSearchParams({ To: to.startsWith('+') ? to : `+${to}`, From: from, Body: body })
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
    if (!res.ok) {
      const err = await res.text()
      return { channel: 'sms', ok: false, error: err.slice(0, 120) }
    }
    return { channel: 'sms', ok: true }
  } catch (e) {
    return { channel: 'sms', ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function sendOpsNotification(alert: OpsAlert | OpsAlertRow): Promise<OpsNotifyResult[]> {
  const results: OpsNotifyResult[] = []

  if ('lastNotifiedAt' in alert && !shouldNotifyAgain(alert)) {
    return [{ channel: 'throttle', ok: true, skipped: true }]
  }

  if (alert.severity === 'info') {
    return [{ channel: 'policy', ok: true, skipped: true }]
  }

  results.push(await notifyWebhook(alert))
  if (alert.severity === 'critical') {
    results.push(await notifyTwilioSms(alert))
  }

  return results
}

export function opsWhatsAppDigestUrl(alerts: OpsAlert[]): string {
  const critical = alerts.filter(a => a.severity === 'critical')
  const warning = alerts.filter(a => a.severity === 'warning')
  const lines = [
    `BBX Ops — ${critical.length} crítico(s), ${warning.length} aviso(s)`,
    '',
    ...critical.slice(0, 5).map(a => `🔴 ${a.title}: ${a.message}`),
    ...warning.slice(0, 5).map(a => `🟠 ${a.title}: ${a.message}`),
  ]
  if (alerts.length > 10) lines.push('', `+${alerts.length - 10} más en /bbx-admin`)
  return bbxWhatsApp(lines.join('\n'))
}

export async function runOpsNotifyPipeline(alerts: OpsAlertRow[]): Promise<{
  notified: number
  results: OpsNotifyResult[]
}> {
  const { markOpsAlertNotified } = await import('@/lib/bbxOpsStore')
  let notified = 0
  const results: OpsNotifyResult[] = []

  for (const alert of alerts) {
    if (alert.severity === 'info') continue
    if (!shouldNotifyAgain(alert)) continue

    const batch = await sendOpsNotification(alert)
    results.push(...batch)
    const anyOk = batch.some(r => r.ok && !r.skipped)
    if (anyOk) {
      await markOpsAlertNotified(alert.id)
      notified++
    }
  }

  return { notified, results }
}
