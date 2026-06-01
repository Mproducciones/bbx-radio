'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <div
      className="relative overflow-hidden rounded-2xl p-5 mb-6"
      style={{ background: 'linear-gradient(135deg, #0F0F1A 0%, #1A0A2E 100%)', border: '1px solid rgba(255,0,110,0.2)' }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,0,110,0.12) 0%, transparent 70%)' }} />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wider mb-1">Escuchando ahora</p>
          <div className="flex items-end gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="text-white font-display text-5xl leading-none tabular-nums"
              >
                {count === null ? '—' : count}
              </motion.span>
            </AnimatePresence>
            <span className="text-[#8888AA] text-sm mb-1.5">oyentes</span>
          </div>
          {trend === 'up' && (
            <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <span>↑</span> Subiendo
            </p>
          )}
          {trend === 'down' && (
            <p className="text-[#FF6B6B] text-xs mt-1 flex items-center gap-1">
              <span>↓</span> Bajando
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          {/* Pulsing live dot */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#FF006E]/20 animate-ping" />
            <div className="absolute inset-1 rounded-full bg-[#FF006E]/10" />
            <div className="w-5 h-5 rounded-full bg-[#FF006E] shadow-lg shadow-[#FF006E]/50" />
          </div>
          <span className="text-[#FF006E] text-[10px] font-bold uppercase tracking-widest">EN VIVO</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <p className="text-[#555577] text-[10px]">Actualiza cada 5 segundos</p>
      </div>
    </div>
  )
}
