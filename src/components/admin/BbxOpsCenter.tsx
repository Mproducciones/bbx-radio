'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminCard, AdminCardHeader, AdminIcons, AdminBadge, AdminKpi, AdminKpiGrid } from './adminUi'
import type { OpsAlertRow } from '@/lib/bbxOpsTypes'

type OpsPayload = {
  alerts: OpsAlertRow[]
  summary: { critical: number; warning: number; info: number; total: number }
  scannedAt: string
  tableAvailable: boolean
  config: {
    webhookUrl: string | null
    notifyPhone: string
    cronEnabled: boolean
    channels: { webhook: boolean; whatsappManual: boolean; sms: boolean }
  }
  whatsappDigestUrl: string
}

const SEV_COLOR = {
  critical: '#FF3860',
  warning: '#FFB300',
  info: '#40B9BF',
}

export function BbxOpsCenter() {
  const [data, setData] = useState<OpsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ops', { credentials: 'include' })
      if (res.ok) setData(await res.json())
      else setMsg('No se pudo cargar el centro de ops')
    } catch {
      setMsg('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 120_000)
    return () => clearInterval(t)
  }, [load])

  async function post(action: string, extra?: Record<string, unknown>) {
    setActing(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/ops', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      })
      const json = await res.json()
      if (res.ok) {
        if (json.alerts) setData(json)
        if (action === 'test_notify') setMsg('Notificación de prueba enviada (revisa ntfy/SMS)')
        if (action === 'notify_now') setMsg(`Enviadas ${json.notified ?? 0} alerta(s)`)
      } else {
        setMsg(json.error ?? 'Error')
      }
    } catch {
      setMsg('Error de conexión')
    } finally {
      setActing(false)
    }
  }

  if (loading && !data) {
    return (
      <AdminCard accent="#FF3860">
        <p className="p-4 text-white/40 text-sm">Escaneando radios y servicios…</p>
      </AdminCard>
    )
  }

  const summary = data?.summary ?? { critical: 0, warning: 0, info: 0, total: 0 }

  return (
    <AdminCard accent="#FF3860">
      <AdminCardHeader title="Centro de operaciones" icon={<AdminIcons.bell />} />
      <p className="px-4 -mt-2 mb-3 text-white/40 text-xs leading-relaxed">
        Te avisa cuando una radio entra en gracia, se suspende, vence pronto o hay cola en cabina.
        Notificación automática vía webhook (ntfy) o SMS Twilio si está configurado.
      </p>

      <div className="px-4 pb-3">
        <AdminKpiGrid>
          <AdminKpi value={summary.critical} sub="Crítico" color="#FF3860" icon={<AdminIcons.wave />} />
          <AdminKpi value={summary.warning} sub="Aviso" color="#FFB300" icon={<AdminIcons.megaphone />} />
          <AdminKpi value={summary.info} sub="Info" color="#40B9BF" icon={<AdminIcons.chart />} />
        </AdminKpiGrid>
      </div>

      <div className="px-4 pb-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={acting}
          onClick={() => post('refresh')}
          className="admin-btn-ghost !min-h-0 !py-2 text-xs"
        >
          Actualizar
        </button>
        <button
          type="button"
          disabled={acting}
          onClick={() => post('notify_now')}
          className="admin-btn-accent !min-h-0 !py-2 text-xs"
          style={{ background: 'linear-gradient(135deg, #FF3860, #db8918)' }}
        >
          Enviar alertas ahora
        </button>
        <button
          type="button"
          disabled={acting}
          onClick={() => post('test_notify')}
          className="admin-btn-ghost !min-h-0 !py-2 text-xs"
        >
          Probar notificación
        </button>
        {data?.whatsappDigestUrl && (
          <a
            href={data.whatsappDigestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-ghost !min-h-0 !py-2 text-xs inline-flex items-center"
            style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.35)' }}
          >
            WhatsApp resumen
          </a>
        )}
      </div>

      {data && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {data.config.channels.webhook && (
            <AdminBadge color="#00D9A0">Webhook activo</AdminBadge>
          )}
          {!data.config.channels.webhook && (
            <AdminBadge color="#FFB300">Sin webhook — configura BBX_OPS_WEBHOOK_URL</AdminBadge>
          )}
          {data.config.channels.sms && <AdminBadge color="#40B9BF">SMS Twilio</AdminBadge>}
          {data.config.cronEnabled && <AdminBadge color="#7D59B5">Cron diario</AdminBadge>}
          {!data.tableAvailable && (
            <AdminBadge color="#FF3860">Ejecuta supabase-bbx-ops.sql</AdminBadge>
          )}
        </div>
      )}

      {msg && <p className="px-4 text-xs text-white/50">{msg}</p>}

      <div className="px-4 pb-4 space-y-2 max-h-[420px] overflow-y-auto">
        {(data?.alerts ?? []).length === 0 ? (
          <p className="text-white/35 text-sm py-6 text-center">Todo en orden — sin alertas abiertas.</p>
        ) : (
          data?.alerts.map(alert => (
            <div
              key={alert.id}
              className="rounded-xl p-3"
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: `1px solid ${SEV_COLOR[alert.severity]}40`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: SEV_COLOR[alert.severity] }}>
                    {alert.severity} · {alert.category}
                    {alert.tenantId ? ` · ${alert.tenantId}` : ''}
                  </p>
                  <p className="text-white font-semibold text-sm mt-0.5">{alert.title}</p>
                  <p className="text-white/50 text-xs mt-1 leading-snug">{alert.message}</p>
                </div>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => post('ack', { alertId: alert.id })}
                  className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg text-white/70 border border-white/10 hover:bg-white/5"
                >
                  OK
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {data?.scannedAt && (
        <p className="px-4 pb-4 text-white/25 text-[10px]">
          Último escaneo: {new Date(data.scannedAt).toLocaleString('es-CL')}
        </p>
      )}
    </AdminCard>
  )
}
