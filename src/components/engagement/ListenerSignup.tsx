'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'form' | 'sending' | 'done' | 'error'

// El locutor o admin configura el sorteo activo — por ahora hardcodeado
const ACTIVE_CONTEST = {
  id: 'sorteo-junio-2026',
  prize: '2 entradas al Festival de Verano 2026',
  description: 'Regístrate y el locutor anuncia al ganador en vivo esta tarde',
  deadline: 'Hoy a las 18:00 hrs',
}

export function ListenerSignup() {
  const [phase, setPhase] = useState<Phase>('form')
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState(0)
  const [errMsg, setErrMsg]     = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setPhase('sending')

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), contest: ACTIVE_CONTEST.id }),
      })
      const data = await res.json()

      if (!res.ok) { setErrMsg(data.error ?? 'Error al registrarse'); setPhase('error'); return }

      setPosition(data.position)
      setPhase('done')
      if (navigator.vibrate) navigator.vibrate([10, 60, 20])
    } catch { setErrMsg('Error de conexión'); setPhase('error') }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(15,15,26,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(64,185,191,0.2)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #40B9BF, transparent)' }} />

      {/* Icono sorteo */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'rgba(64,185,191,0.15)', border: '1px solid rgba(64,185,191,0.25)' }}>
          🎁
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Sorteo en vivo</p>
          <p className="text-[#40B9BF] text-xs font-semibold">{ACTIVE_CONTEST.prize}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'form' && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={submit}
            className="px-4 py-4 flex flex-col gap-3"
          >
            <p className="text-white/50 text-xs leading-relaxed">{ACTIVE_CONTEST.description}</p>
            <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-wide">{ACTIVE_CONTEST.deadline}</p>

            <label className="flex flex-col gap-1">
              <span className="text-white/40 text-xs">Tu nombre</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ej: María González"
                required maxLength={60}
                className="bg-white/[0.04] border border-white/[0.08] focus:border-[#40B9BF] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-white/20"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-white/40 text-xs">Número de WhatsApp</span>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="ej: 9 1234 5678"
                type="tel" required maxLength={15}
                className="bg-white/[0.04] border border-white/[0.08] focus:border-[#40B9BF] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-white/20"
              />
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!name.trim() || !phone.trim()}
              className="w-full py-3 rounded-xl font-bold text-sm text-[#07070E] disabled:opacity-40 transition-opacity"
              style={{ background: '#40B9BF' }}
            >
              Participar en el sorteo →
            </motion.button>

            <p className="text-white/20 text-[10px] text-center">Sin spam · Solo te contactamos si ganás</p>
          </motion.form>
        )}

        {phase === 'sending' && (
          <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 py-8 flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-[#40B9BF] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-sm">Registrando...</p>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-6 flex flex-col items-center gap-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="text-5xl"
            >
              🎉
            </motion.div>
            <div>
              <p className="text-white font-bold text-base">¡Estás participando!</p>
              <p className="text-white/50 text-sm mt-1">El locutor anunciará al ganador en vivo</p>
            </div>
            <div className="rounded-xl px-5 py-3 text-center"
              style={{ background: 'rgba(64,185,191,0.1)', border: '1px solid rgba(64,185,191,0.2)' }}>
              <p className="text-[#40B9BF] text-xs font-semibold uppercase tracking-wide">Tu número</p>
              <p className="font-display text-4xl text-white leading-none mt-1">#{position}</p>
              <p className="text-white/30 text-xs mt-1">en la lista de participantes</p>
            </div>
            <p className="text-white/30 text-xs">Mantén el radio encendido 🔊</p>
          </motion.div>
        )}

        {phase === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 py-6 flex flex-col items-center gap-3 text-center">
            <p className="text-red-400 text-sm">{errMsg}</p>
            <button onClick={() => { setPhase('form'); setErrMsg('') }}
              className="text-white/50 text-xs underline">Intentar de nuevo</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
