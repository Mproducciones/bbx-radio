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

export function ListenerSignup() {
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
      <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(15,15,26,0.72)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/45 text-sm">No hay sorteo activo en este momento.</p>
        <p className="text-white/30 text-xs mt-1">Vuelve pronto o escucha en vivo por novedades.</p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl flex flex-col flex-1 min-h-0"
      style={{
        background: 'rgba(15,15,26,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(219,137,24,0.2)',
      }}
    >
      <div className="p-4 border-b border-white/5 shrink-0">
        <p className="text-[#db8918] text-[9px] font-bold uppercase tracking-wider mb-1">Sorteo patrocinado</p>
        <h3 className="text-white font-bold text-sm leading-tight">{contest.title}</h3>
        <p className="text-[#40B9BF] text-xs font-semibold mt-1">{contest.prize}</p>
        {contest.sponsorName && <p className="text-white/35 text-[10px] mt-0.5">Auspicia: {contest.sponsorName}</p>}
      </div>

      <div className="p-4 flex-1 min-h-0 overflow-y-auto">
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
                className="w-full px-3 py-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm"
              />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="WhatsApp / teléfono"
                inputMode="tel"
                className="w-full px-3 py-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm"
              />
              <button type="submit" className="w-full min-h-[44px] py-3 rounded-xl text-sm font-bold text-[#07070e]" style={{ background: '#db8918' }}>
                Participar en el sorteo
              </button>
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
