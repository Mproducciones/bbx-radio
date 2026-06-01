'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Saludo } from '@/lib/saludoTypes'

const MOTIVO_EMOJI: Record<string, string> = {
  cumpleanos: '🎂', aniversario: '💑', dedicatoria: '🎵',
  apoyo: '💪', extrañas: '💭', saludo: '👋',
}

type Filter = 'pending' | 'al_aire' | 'leido'

export function SaludosPanel() {
  const [saludos, setSaludos] = useState<Saludo[]>([])
  const [filter, setFilter]   = useState<Filter>('pending')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchSaludos = useCallback(async () => {
    try {
      const res = await fetch('/api/saludos', { credentials: 'include' })
      if (!res.ok) return
      setSaludos(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSaludos()
    const t = setInterval(fetchSaludos, 30_000)
    return () => clearInterval(t)
  }, [fetchSaludos])

  async function updateStatus(id: string, status: Saludo['status']) {
    setUpdating(id)
    try {
      await fetch(`/api/saludos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      setSaludos(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    } finally {
      setUpdating(null)
    }
  }

  const filtered = saludos.filter(s => s.status === filter)
  const pendingCount = saludos.filter(s => s.status === 'pending').length

  const tabs: { key: Filter; label: string }[] = [
    { key: 'pending',  label: `Pendientes${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { key: 'al_aire',  label: 'Al aire' },
    { key: 'leido',    label: 'Leídos' },
  ]

  return (
    <div className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#1A1A2E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">👋</span>
          <p className="text-white font-semibold text-sm">Saludos al aire</p>
          {pendingCount > 0 && (
            <span className="bg-[#db8918] text-[#07070E] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </div>
        <button
          onClick={fetchSaludos}
          className="text-[#444468] hover:text-white transition-colors text-xs"
        >
          ↻ actualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1A1A2E]">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="flex-1 py-2.5 text-xs font-medium transition-colors"
            style={filter === tab.key
              ? { color: '#db8918', borderBottom: '2px solid #db8918' }
              : { color: '#444468' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="divide-y divide-[#1A1A2E] max-h-96 overflow-y-auto">
        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-5 h-5 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-[#444468] text-xs">
            {filter === 'pending' ? 'Sin saludos pendientes' : 'Nada aquí aún'}
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map(s => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-3"
              >
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{MOTIVO_EMOJI[s.motivo] ?? '👋'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-white font-semibold text-sm">{s.para}</span>
                      <span className="text-[#444468] text-xs">de {s.de}</span>
                    </div>
                    {s.mensaje && (
                      <p className="text-[#AAAACC] text-xs mt-0.5 leading-relaxed">"{s.mensaje}"</p>
                    )}
                    <p className="text-[#333355] text-[10px] mt-1">
                      {new Date(s.submitted_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                {s.status === 'pending' && (
                  <div className="flex gap-2 mt-2.5 ml-9">
                    <button
                      onClick={() => updateStatus(s.id, 'al_aire')}
                      disabled={updating === s.id}
                      className="flex-1 py-2 rounded-lg text-xs font-bold text-[#07070E] disabled:opacity-50 transition-opacity"
                      style={{ background: '#db8918' }}
                    >
                      📻 Leer al aire
                    </button>
                    <button
                      onClick={() => updateStatus(s.id, 'leido')}
                      disabled={updating === s.id}
                      className="py-2 px-3 rounded-lg text-xs text-[#666690] bg-[#07070E] border border-[#1A1A2E] hover:text-white transition-colors disabled:opacity-50"
                    >
                      Descartar
                    </button>
                  </div>
                )}

                {s.status === 'al_aire' && (
                  <div className="flex gap-2 mt-2.5 ml-9">
                    <button
                      onClick={() => updateStatus(s.id, 'leido')}
                      disabled={updating === s.id}
                      className="py-2 px-3 rounded-lg text-xs text-[#666690] bg-[#07070E] border border-[#1A1A2E] hover:text-white transition-colors disabled:opacity-50"
                    >
                      ✓ Marcar leído
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
