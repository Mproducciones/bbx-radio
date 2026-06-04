'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'form' | 'sending' | 'done' | 'error'

type ActiveContest = {
  id: string
  title: string
  prize: string
  description: string | null
  sponsorName: string | null
  deadline: string | null
}

export function ListenerSignup({ playful }: { playful?: boolean } = {}) {
  const [contest, setContest] = useState<ActiveContest | null>(null)
  const [phase, setPhase] = useState<Phase>('form')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState(0)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    fetch('/api/contests/active')
      .then(r => r.json())
      .then(data => { if (data?.id) setContest(data) })
      .catch(() => {})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!contest || !name.trim() || !phone.trim()) return
    setPhase('sending')

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), contest: contest.id }),
      })
      const data = await res.json()

      if (!res.ok) { setErrMsg(data.error ?? 'Error al registrarse'); setPhase('error'); return }

      setPosition(data.position)
      setPhase('done')
      if (navigator.vibrate) navigator.vibrate([10, 60, 20])
    } catch { setErrMsg('Error de conexión'); setPhase('error') }
  }

  if (!contest) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5 text-center flex-1 flex flex-col items-center justify-center gap-3"
        style={{
          background: playful
            ? 'linear-gradient(160deg, rgba(125,89,181,0.12) 0%, rgba(15,15,26,0.92) 100%)'
            : 'rgba(15,15,26,0.72)',
          border: '1px solid rgba(125,89,181,0.2)',
        }}
      >
        <motion.span
          className="text-4xl"
          animate={{ rotate: [0, -12, 12, 0], y: [0, -4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          🎁
        </motion.span>
        <p className="font-display text-lg text-white">Próximo sorteo en camino</p>
        <p className="text-white/40 text-xs max-w-[200px]">Quédate en la radio: el locutor anuncia los concursos al aire.</p>
      </motion.div>
    )
  }

  return (
    <div
      className="participa-panel relative overflow-hidden flex flex-col flex-1 min-h-0"
      style={{
        background: playful
          ? 'linear-gradient(165deg, rgba(125,89,181,0.15) 0%, rgba(15,15,26,0.95) 50%, #07070e 100%)'
          : 'rgba(15,15,26,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: playful ? '1px solid rgba(125,89,181,0.35)' : '1px solid rgba(219,137,24,0.2)',
        boxShadow: playful ? '0 12px 36px -14px rgba(125,89,181,0.4)' : undefined,
      }}
    >
      {playful && (
        <motion.div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 blur-2xl pointer-events-none"
          style={{ background: '#7D59B5' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
      <div className="px-3.5 py-3 border-b border-white/5 shrink-0 relative z-[1]">
        <p className="text-[#7D59B5] text-[10px] font-black uppercase tracking-[0.12em] mb-1">Sorteo en vivo</p>
        <h3 className="text-white font-display text-lg leading-tight">{contest.title}</h3>
        <p className="text-[#40B9BF] text-sm font-semibold mt-1">{contest.prize}</p>
        {contest.sponsorName && <p className="text-white/40 text-xs mt-0.5">Auspicia: {contest.sponsorName}</p>}
      </div>

      <div className="px-3.5 py-3 flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">
          {phase === 'form' && (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} className="space-y-3">
              {contest.description && <p className="text-white/50 text-xs leading-relaxed">{contest.description}</p>}
              {contest.deadline && <p className="text-white/30 text-[10px]">Cierra: {contest.deadline}</p>}
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
                maxLength={60}
                className="participa-input"
                style={{ '--input-accent': '#7D59B5' } as React.CSSProperties}
              />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="WhatsApp / teléfono"
                inputMode="tel"
                className="participa-input"
                style={{ '--input-accent': '#7D59B5' } as React.CSSProperties}
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="participa-btn-primary relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #7D59B5, #db8918)' }}
              >
                ¡Quiero participar! 🎁
              </motion.button>
              <p className="text-white/25 text-[9px] text-center">Tus datos se usan solo para este concurso.</p>
            </motion.form>
          )}

          {phase === 'sending' && (
            <motion.div key="sending" className="py-8 text-center text-white/50 text-sm">Enviando…</motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
              <p className="text-[#00D9A0] text-xs font-bold uppercase tracking-wider">¡Registrado!</p>
              <p className="font-display text-4xl text-white leading-none mt-2">#{position}</p>
              <p className="text-white/50 text-xs mt-2">El locutor anuncia al ganador en vivo. ¡Suerte!</p>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div key="error" className="text-center py-4">
              <p className="text-red-400 text-sm mb-3">{errMsg}</p>
              <button type="button" onClick={() => setPhase('form')} className="text-xs text-white/50 underline">Intentar de nuevo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
