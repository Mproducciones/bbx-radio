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
      <div
        className="relative overflow-hidden p-5 h-full flex flex-col"
        style={{ background: 'linear-gradient(145deg, rgba(26,10,46,0.6) 0%, rgba(14,14,22,0.4) 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(219,137,24,0.15) 0%, transparent 65%)' }}
        />

        <div className="relative flex items-start justify-between gap-4 flex-1">
          <div className="min-w-0">
            <p className="text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-2">Escuchando ahora</p>
            <div className="flex items-end gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={count}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="text-white font-display text-4xl sm:text-5xl leading-none tabular-nums"
                >
                  {count === null ? '—' : count}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/40 text-sm mb-1">oyentes</span>
            </div>
            {trend === 'up' && (
              <p className="text-[#00D9A0] text-xs mt-2 flex items-center gap-1 font-medium">
                <span aria-hidden>↑</span> Subiendo
              </p>
            )}
            {trend === 'down' && (
              <p className="text-[#FF6B6B] text-xs mt-2 flex items-center gap-1 font-medium">
                <span aria-hidden>↓</span> Bajando
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#db8918]/25 animate-ping" />
              <div className="absolute inset-1 rounded-full bg-[#db8918]/12" />
              <div className="w-4 h-4 rounded-full bg-[#db8918] shadow-lg shadow-[#db8918]/40" />
            </div>
            <span className="text-[#db8918] text-[9px] font-black uppercase tracking-widest">En vivo</span>
          </div>
        </div>

        <div className="relative mt-4 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D9A0] animate-pulse" />
          <p className="text-white/30 text-[10px]">Actualiza cada 5 segundos</p>
        </div>
      </div>
    </AdminCard>
  )
}
