'use client'

import { useState, useEffect } from 'react'
import { AdminCard, AdminCardHeader, AdminIcons } from './adminUi'

type SendState = 'idle' | 'sending' | 'done' | 'error'

export function NotificacionPanel() {
  const [title, setTitle]   = useState('')
  const [body, setBody]     = useState('')
  const [url, setUrl]       = useState('/')
  const [state, setState]   = useState<SendState>('idle')
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [subs, setSubs]     = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/push/count', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setSubs(d.count))
      .catch(() => {})
  }, [])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, body, url }),
      })
      const data = await res.json()
      if (!res.ok) { setState('error'); return }
      setResult({ sent: data.sent, failed: data.failed })
      setState('done')
      setTitle(''); setBody(''); setUrl('/')
    } catch { setState('error') }
  }

  return (
    <AdminCard accent="#db8918">
      <AdminCardHeader
        title="Enviar notificación"
        icon={<AdminIcons.bell />}
        action={subs !== null ? (
          <span className="text-white/35 text-xs">{subs} suscriptor{subs !== 1 ? 'es' : ''}</span>
        ) : undefined}
      />

      <div className="admin-card-body">
        {state === 'done' && result && (
          <div className="mb-4 rounded-xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(0,217,160,0.08)', border: '1px solid rgba(0,217,160,0.2)' }}>
            <span className="text-xl">✅</span>
            <div>
              <p className="text-[#00D9A0] font-bold text-sm">¡Enviada!</p>
              <p className="text-white/40 text-xs">{result.sent} recibidas · {result.failed} fallaron</p>
            </div>
            <button onClick={() => setState('idle')} className="ml-auto text-white/30 text-xs underline">Nueva</button>
          </div>
        )}

        {state !== 'done' && (
          <form onSubmit={send} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[#666690] text-xs font-medium">Título</span>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="ej: ¡Concurso esta noche!"
                maxLength={80} required
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#db8918] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-white/15"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-[#666690] text-xs font-medium">Mensaje</span>
                <span className="text-[#333355] text-xs">{body.length}/160</span>
              </div>
              <textarea value={body} onChange={e => setBody(e.target.value.slice(0, 160))}
                placeholder="ej: Llama al 93.3 y gana 2 entradas al show"
                rows={2} required
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#db8918] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors resize-none placeholder-white/15"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[#666690] text-xs font-medium">Destino al tocar <span className="text-[#333355]">(opcional)</span></span>
              <div className="flex gap-2">
                {['/', '/saludos', '/tv', '/anunciate'].map(u => (
                  <button key={u} type="button" onClick={() => setUrl(u)}
                    className="text-[10px] px-2 py-1 rounded-lg transition-colors"
                    style={url === u
                      ? { background: 'rgba(219,137,24,0.2)', color: '#db8918', border: '1px solid rgba(219,137,24,0.3)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#444468', border: '1px solid rgba(255,255,255,0.06)' }
                    }>
                    {u === '/' ? 'Inicio' : u.replace('/', '')}
                  </button>
                ))}
              </div>
            </label>

            <button type="submit" disabled={state === 'sending' || !title || !body}
              className="w-full py-3 rounded-xl font-bold text-sm text-[#07070E] disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #db8918, #a86611)' }}>
              {state === 'sending'
                ? <><div className="w-4 h-4 border-2 border-[#07070E] border-t-transparent rounded-full animate-spin" /> Enviando...</>
                : <>Enviar a {subs ?? '...'} oyentes</>
              }
            </button>
          </form>
        )}
      </div>
    </AdminCard>
  )
}
