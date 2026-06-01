'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Stats {
  listeners: number
  registrations: number
  requests: number
  poll: { totalVotes: number; question: string; options: any[] } | null
}

export function AnalyticsPanel() {
  const [stats, setStats] = useState<Stats>({ listeners: 0, registrations: 0, requests: 0, poll: null })

  useEffect(() => {
    async function load() {
      const [lRes, rRes, sRes, pRes] = await Promise.allSettled([
        fetch('/api/listeners/count'),
        fetch('/api/registro', { credentials: 'include' }),
        fetch('/api/solicitudes'),
        fetch('/api/poll', { headers: { 'x-session-id': 'admin' } }),
      ])
      const listeners    = lRes.status === 'fulfilled' ? (await lRes.value.json()).count : 0
      const regData      = rRes.status === 'fulfilled' ? await rRes.value.json() : null
      const requests     = sRes.status === 'fulfilled' ? (await sRes.value.json()).filter((r: any) => r.status === 'pending').length : 0
      const poll         = pRes.status === 'fulfilled' ? await pRes.value.json() : null
      setStats({ listeners, registrations: regData?.stats?.total ?? 0, requests, poll })
    }
    load()
    const t = setInterval(load, 10_000)
    return () => clearInterval(t)
  }, [])

  const METRICS = [
    { label: 'Escuchando ahora',   value: stats.listeners,       icon: '📻', color: '#db8918', sub: 'oyentes activos' },
    { label: 'Oyentes registrados', value: stats.registrations,  icon: '👥', color: '#40B9BF', sub: 'leads capturados' },
    { label: 'Solicitudes',         value: stats.requests,       icon: '🎵', color: '#7D59B5', sub: 'pendientes hoy' },
  ]

  return (
    <div className="flex flex-col gap-4 mt-6">
      <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wider">Métricas en tiempo real</p>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl p-3 text-center"
            style={{ background: '#0F0F1A', border: `1px solid ${m.color}20` }}
          >
            <div className="text-xl mb-1">{m.icon}</div>
            <p className="font-display text-2xl text-white leading-none">{m.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: m.color }}>{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Poll activo */}
      {stats.poll && (
        <div className="rounded-xl p-4" style={{ background: '#0F0F1A', border: '1px solid rgba(219,137,24,0.15)' }}>
          <p className="text-[#8888AA] text-[10px] font-bold uppercase tracking-wider mb-2">Votación activa</p>
          <p className="text-white text-sm font-semibold mb-3">{stats.poll.question}</p>
          {stats.poll.options.map((opt: any) => {
            const total = stats.poll!.totalVotes
            const pv = total === 0 ? 50 : Math.round((opt.votes / total) * 100)
            const color = opt.id === 'a' ? '#db8918' : '#40B9BF'
            return (
              <div key={opt.id} className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-xs">{opt.title} — {opt.artist}</span>
                  <span className="font-bold text-xs" style={{ color }}>{pv}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${pv}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    style={{ background: color }}
                  />
                </div>
              </div>
            )
          })}
          <p className="text-white/30 text-[10px] mt-2">{stats.poll.totalVotes} votos totales</p>
        </div>
      )}
    </div>
  )
}
