'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminCard } from './adminUi'

export function LiveListenerCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [prev, setPrev] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchCount() {
    try {
      const res = await fetch('/api/listeners/count')
      const data = await res.json()
      setCount(c => { if (c !== null) setPrev(c); return data.count })
    } catch {}
  }

  useEffect(() => {
    fetchCount()
    intervalRef.current = setInterval(fetchCount, 5_000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const trend = prev !== null && count !== null
    ? count > prev ? 'up' : count < prev ? 'down' : 'same'
    : 'same'

  return (
    <AdminCard accent="#db8918" className="h-full">
      <div className="admin-live-hero h-full flex flex-col">
        <div className="admin-live-hero__glow" aria-hidden />

        <div className="relative flex items-start justify-between gap-4 flex-1">
          <div className="min-w-0">
            <p className="admin-eyebrow mb-2">Escuchando ahora</p>
            <div className="flex items-end gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={count}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="text-white font-display text-5xl sm:text-6xl leading-none tabular-nums"
                >
                  {count === null ? '—' : count}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/45 text-base mb-1.5 font-medium">oyentes</span>
            </div>
            {trend === 'up' && (
              <p className="text-[#00D9A0] text-sm mt-3 flex items-center gap-1.5 font-bold">
                <span aria-hidden>↑</span> Subiendo
              </p>
            )}
            {trend === 'down' && (
              <p className="text-[#FF6B6B] text-sm mt-3 flex items-center gap-1.5 font-bold">
                <span aria-hidden>↓</span> Bajando
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#db8918]/25 animate-ping" />
              <div className="absolute inset-1 rounded-full bg-[#db8918]/12" />
              <div className="w-5 h-5 rounded-full bg-[#db8918] shadow-lg shadow-[#db8918]/40" />
            </div>
            <span className="text-[#db8918] text-xs font-black uppercase tracking-widest">En vivo</span>
          </div>
        </div>

        <div className="relative mt-4 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D9A0] animate-pulse" />
          <p className="admin-hint">Actualiza cada 5 segundos</p>
        </div>
      </div>
    </AdminCard>
  )
}
