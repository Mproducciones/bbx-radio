'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminCard, AdminCardHeader, AdminIcons } from './adminUi'
import { NOTIFICATION_VISIBLE_PRESETS, type NotificationVisibleHours } from '@/lib/notificationSettings'
import { RADIO_TAGLINE } from '@/lib/radioConfig'

type SendState = 'idle' | 'sending' | 'done' | 'error'

type PushStatus = {
  configured: boolean
  dbReady: boolean
  ready: boolean
  count: number
  hint?: string
  dbError?: string
}

const DESTINOS: { url: string; label: string }[] = [
  { url: '/', label: 'Inicio' },
  { url: '/participa', label: 'Participa' },
  { url: '/saludos', label: 'Saludos' },
  { url: '/programacion', label: 'Grilla' },
  { url: '/tv', label: 'TV' },
]

const PLANTILLAS_LOCUTOR = [
  {
    title: 'Pide tu canción',
    body: 'Entra a la app y manda tu tema al locutor en vivo.',
    url: '/participa',
  },
  {
    title: 'Sorteo en la app',
    body: 'Participa en el sorteo desde tu celular — el locutor te espera.',
    url: '/participa',
  },
  {
    title: 'Saludo al aire',
    body: 'Manda un saludo a quien quieras; lo leemos en cabina.',
    url: '/saludos',
  },
  {
    title: 'Grilla de hoy',
    body: `Mira qué programa viene — ${RADIO_TAGLINE}.`,
    url: '/programacion',
  },
] as const

export function NotificacionPanel() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('/participa')
  const [state, setState] = useState<SendState>('idle')
  const [result, setResult] = useState<{ sent: number; failed: number; total?: number } | null>(null)
  const [status, setStatus] = useState<PushStatus | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [visibleHours, setVisibleHours] = useState<NotificationVisibleHours>(48)

  const loadStatus = useCallback(() => {
    fetch('/api/push/status', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then((d: PushStatus | null) => d && setStatus(d))
      .catch(() => {})
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  function applyPlantilla(p: (typeof PLANTILLAS_LOCUTOR)[number]) {
    setTitle(p.title)
    setBody(p.body)
    setUrl(p.url)
    setState('idle')
    setSendError(null)
  }

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!status?.ready) return
    setState('sending')
    setSendError(null)
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, body, url, visibleHours }),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        const extra = data.hint ? ` ${data.hint}` : data.dbError ? ` ${data.dbError}` : data.missing?.length ? ` (${data.missing.join(', ')})` : ''
        setSendError(`${data.error ?? 'No se pudo enviar'}${extra}`)
        setState('error')
        if (res.status === 401) loadStatus()
        return
      }
      setResult({ sent: data.sent, failed: data.failed, total: data.total })
      setState('done')
      setTitle('')
      setBody('')
      setUrl('/participa')
      loadStatus()
    } catch {
      setSendError('Error de conexión')
      setState('error')
    }
  }

  const subs = status?.count ?? null

  return (
    <AdminCard accent="#7D59B5">
      <AdminCardHeader
        title="Avisar a la audiencia"
        icon={<AdminIcons.bell />}
        action={subs !== null ? (
          <span className="text-white/35 text-xs">
            {subs} suscriptor{subs !== 1 ? 'es' : ''}
          </span>
        ) : undefined}
      />

      <div className="admin-card-body">
        <p className="text-white/45 text-xs leading-relaxed mb-4">
          Cada envío se guarda en la <strong className="text-white/65">lista de En Vivo</strong> (campanita arriba)
          y muestra un <strong className="text-white/65">globo</strong> en todas las pantallas. También hace push si hay suscriptores.
        </p>

        {status && !status.ready && (
          <div
            className="mb-4 rounded-xl p-3 text-xs leading-relaxed"
            style={{ background: 'rgba(255,56,96,0.08)', border: '1px solid rgba(255,56,96,0.25)' }}
          >
            <p className="text-[#FF3860] font-bold text-sm mb-1">Push no listo en producción</p>
            {!status.configured && (
              <p className="text-white/50">Configura en Vercel: <code className="text-white/70">NEXT_PUBLIC_VAPID_PUBLIC_KEY</code>, <code className="text-white/70">VAPID_PRIVATE_KEY</code>, <code className="text-white/70">VAPID_EMAIL</code>. Sin VAPID igual se guarda en la campanita si existe la tabla de avisos.</p>
            )}
            {status.configured && !status.dbReady && (
              <p className="text-white/50 mt-1">En Supabase: <code className="text-white/70">supabase-app-notifications.sql</code> y <code className="text-white/70">supabase-push.sql</code>.</p>
            )}
            {status.dbError && (
              <p className="text-white/30 mt-1 font-mono text-[10px] break-all">{status.dbError}</p>
            )}
            {status.hint && <p className="text-white/40 mt-2">{status.hint}</p>}
          </div>
        )}

        {status?.ready && subs === 0 && (
          <div
            className="mb-4 rounded-xl p-3 text-xs"
            style={{ background: 'rgba(219,137,24,0.08)', border: '1px solid rgba(219,137,24,0.22)' }}
          >
            <p className="text-[#db8918] font-semibold">Aún sin suscriptores</p>
            <p className="text-white/45 mt-1">
              Pide en vivo que abran la app y pulsen <strong className="text-white/70">Activar</strong> cuando salga el aviso de notificaciones.
            </p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-[#666690] text-[10px] font-bold uppercase tracking-wider mb-2">Plantillas para locutor</p>
          <div className="flex flex-wrap gap-2">
            {PLANTILLAS_LOCUTOR.map(p => (
              <button
                key={p.title}
                type="button"
                onClick={() => applyPlantilla(p)}
                className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
                style={{
                  background: 'rgba(125,89,181,0.15)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(125,89,181,0.28)',
                }}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {state === 'done' && result && (
          <div
            className="mb-4 rounded-xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(0,217,160,0.08)', border: '1px solid rgba(0,217,160,0.2)' }}
          >
            <span className="text-[#00D9A0] text-lg font-bold" aria-hidden>✓</span>
            <div>
              <p className="text-[#00D9A0] font-bold text-sm">Enviada</p>
              <p className="text-white/40 text-xs">
                Visible en En Vivo {visibleHours}h · globo en la app · campanita en inicio.
                {result.total != null && result.total > 0
                  ? ` Push: ${result.sent} de ${result.total}${result.failed > 0 ? ` (${result.failed} fallaron)` : ''}.`
                  : ' Sin push activo en celulares aún.'}
              </p>
            </div>
            <button type="button" onClick={() => setState('idle')} className="ml-auto text-white/30 text-xs underline">
              Nueva
            </button>
          </div>
        )}

        {state === 'error' && sendError && (
          <div className="mb-4 rounded-xl p-3 text-red-400/90 text-sm">{sendError}</div>
        )}

        {state !== 'done' && (
          <form onSubmit={send} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[#666690] text-xs font-medium">Título</span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ej: ¡Concurso esta noche!"
                maxLength={80}
                required
                disabled={!status?.ready}
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#7D59B5] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-white/15 disabled:opacity-40"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-[#666690] text-xs font-medium">Mensaje</span>
                <span className="text-[#333355] text-xs">{body.length}/160</span>
              </div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value.slice(0, 160))}
                placeholder="ej: Entra a la app y participa en el sorteo"
                rows={3}
                required
                disabled={!status?.ready}
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#7D59B5] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors resize-none placeholder-white/15 disabled:opacity-40"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[#666690] text-xs font-medium">Visible en En Vivo durante</span>
              <div className="flex flex-wrap gap-2">
                {NOTIFICATION_VISIBLE_PRESETS.map(p => (
                  <button
                    key={p.hours}
                    type="button"
                    disabled={!status?.ready}
                    onClick={() => setVisibleHours(p.hours)}
                    className="text-[10px] px-2 py-1 rounded-lg transition-colors disabled:opacity-40"
                    style={
                      visibleHours === p.hours
                        ? { background: 'rgba(125,89,181,0.25)', color: '#c4b5fd', border: '1px solid rgba(125,89,181,0.4)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#444468', border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[#666690] text-xs font-medium">Al tocar, abre</span>
              <div className="flex flex-wrap gap-2">
                {DESTINOS.map(d => (
                  <button
                    key={d.url}
                    type="button"
                    disabled={!status?.ready}
                    onClick={() => setUrl(d.url)}
                    className="text-[10px] px-2 py-1 rounded-lg transition-colors disabled:opacity-40"
                    style={
                      url === d.url
                        ? { background: 'rgba(125,89,181,0.25)', color: '#c4b5fd', border: '1px solid rgba(125,89,181,0.4)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#444468', border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </label>

            <button
              type="submit"
              disabled={state === 'sending' || !title || !body || !status?.ready}
              className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7D59B5, #FF006E)' }}
            >
              {state === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando…
                </>
              ) : (
                <>Enviar a {subs ?? '…'} oyentes</>
              )}
            </button>
          </form>
        )}

        <p className="text-white/20 text-[9px] text-center mt-3 leading-relaxed">
          Solo oyentes que aceptaron notificaciones. Ideal para decirlo en vivo antes de enviar.
        </p>
      </div>
    </AdminCard>
  )
}
