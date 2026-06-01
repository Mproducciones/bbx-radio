'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SongRequest } from '@/lib/songRequestStore'

const STATUS_LABEL: Record<SongRequest['status'], string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  played: 'Al aire',
  rejected: 'Rechazada',
}

const STATUS_COLOR: Record<SongRequest['status'], string> = {
  pending: '#FFB300',
  approved: '#00D4FF',
  played: '#00D9A0',
  rejected: '#FF3860',
}

export function SolicitudesPanel() {
  const [queue, setQueue] = useState<SongRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/solicitudes')
      const data = await res.json()
      setQueue(data)
    } catch {} finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 8_000)
    return () => clearInterval(interval)
  }, [fetchQueue])

  async function updateStatus(id: string, status: SongRequest['status']) {
    setUpdating(id)
    try {
      await fetch(`/api/solicitudes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      await fetchQueue()
    } catch {} finally {
      setUpdating(null)
    }
  }

  const pending = queue.filter(r => r.status === 'pending')
  const rest = queue.filter(r => r.status !== 'pending').slice(0, 10)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wider">
          Solicitudes de canciones
        </p>
        {pending.length > 0 && (
          <span className="text-[10px] font-bold text-[#db8918] bg-[#db8918]/10 px-2 py-0.5 rounded-full">
            {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && queue.length === 0 && (
        <div className="text-center py-8 text-[#444468] text-sm">
          Aún no hay solicitudes
        </div>
      )}

      {!loading && pending.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          <AnimatePresence>
            {pending.map((req, i) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl p-4"
                style={{ background: '#0F0F1A', border: '1px solid rgba(255,179,0,0.2)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{req.song}</p>
                    <p className="text-[#8888AA] text-xs">{req.artist}</p>
                    {req.dedication && (
                      <p className="text-[#666690] text-xs italic mt-1">"{req.dedication}"</p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ color: STATUS_COLOR[req.status], background: `${STATUS_COLOR[req.status]}18` }}>
                    {STATUS_LABEL[req.status]}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(req.id, 'played')}
                    disabled={updating === req.id}
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-opacity disabled:opacity-50"
                    style={{ background: '#00D9A0' }}
                  >
                    Al aire 🎵
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'approved')}
                    disabled={updating === req.id}
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-opacity disabled:opacity-50"
                    style={{ background: '#00D4FF22', color: '#00D4FF', border: '1px solid #00D4FF44' }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'rejected')}
                    disabled={updating === req.id}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-opacity disabled:opacity-50"
                    style={{ background: '#FF386022', color: '#FF3860', border: '1px solid #FF386044' }}
                  >
                    Rechazar
                  </button>
                </div>

                <p className="text-[#444468] text-[10px] mt-2">
                  {new Date(req.submittedAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && rest.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#444468] text-[10px] uppercase tracking-wider mb-1">Historial reciente</p>
          {rest.map(req => (
            <div key={req.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0F0F1A]">
              <div className="flex-1 min-w-0">
                <p className="text-[#CCCCDD] text-xs truncate">{req.song} — {req.artist}</p>
              </div>
              <span className="text-[10px] font-bold flex-shrink-0"
                style={{ color: STATUS_COLOR[req.status] }}>
                {STATUS_LABEL[req.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
