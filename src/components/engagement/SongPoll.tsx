'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PollOption {
  id: string
  title: string
  artist: string
  votes: number
}

interface Poll {
  id: string
  question: string
  options: [PollOption, PollOption]
  active: boolean
  totalVotes: number
  myVote: string | null
}

function pct(votes: number, total: number) {
  if (total === 0) return 50
  return Math.round((votes / total) * 100)
}

function getSession(): string {
  if (typeof sessionStorage === 'undefined') return 'anon'
  let id = sessionStorage.getItem('pulso_session')
  if (!id) { id = Date.now().toString(36) + Math.random().toString(36).slice(2); sessionStorage.setItem('pulso_session', id) }
  return id
}

export function SongPoll() {
  const [poll, setPoll]   = useState<Poll | null>(null)
  const [voting, setVoting] = useState(false)
  const [justVoted, setJustVoted] = useState(false)

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch('/api/poll', { headers: { 'x-session-id': getSession() } })
      const data = await res.json()
      setPoll(data)
    } catch {}
  }, [])

  useEffect(() => {
    fetchPoll()
    const t = setInterval(fetchPoll, 8_000)
    return () => clearInterval(t)
  }, [fetchPoll])

  async function castVote(optionId: string) {
    if (voting || poll?.myVote) return
    setVoting(true)
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': getSession() },
        body: JSON.stringify({ optionId }),
      })
      const data = await res.json()
      if (data.poll) { setPoll({ ...data.poll, myVote: optionId }); setJustVoted(true) }
      if (navigator.vibrate) navigator.vibrate([10, 40, 20])
    } catch {} finally { setVoting(false) }
  }

  if (!poll || !poll.active) return null

  const voted = !!poll.myVote
  const [a, b] = poll.options
  const pA = pct(a.votes, poll.totalVotes)
  const pB = pct(b.votes, poll.totalVotes)
  const winner = voted && a.votes !== b.votes ? (a.votes > b.votes ? a.id : b.id) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(15,15,26,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(219,137,24,0.2)',
      }}
    >
      {/* Accent top */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #db8918, #40B9BF, transparent)' }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
          <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest">Vota ahora</p>
          {poll.totalVotes > 0 && (
            <span className="ml-auto text-white/30 text-[10px]">{poll.totalVotes} voto{poll.totalVotes !== 1 ? 's' : ''}</span>
          )}
        </div>

        <p className="text-white font-bold text-sm mb-4 leading-snug">{poll.question}</p>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-3">
          {[a, b].map(opt => {
            const pv  = opt.id === a.id ? pA : pB
            const isWinner = winner === opt.id
            const isMine   = poll.myVote === opt.id
            const isOther  = voted && !isMine
            const accent   = opt.id === a.id ? '#db8918' : '#40B9BF'

            return (
              <motion.button
                key={opt.id}
                whileTap={voted ? {} : { scale: 0.96 }}
                onClick={() => castVote(opt.id)}
                disabled={voted || voting}
                className="relative overflow-hidden rounded-xl p-4 text-left transition-all"
                style={{
                  background: isMine ? `${accent}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isMine ? accent + '50' : 'rgba(255,255,255,0.06)'}`,
                  opacity: isOther && !isMine ? 0.6 : 1,
                  cursor: voted ? 'default' : 'pointer',
                }}
              >
                {/* Barra de progreso */}
                {voted && (
                  <motion.div
                    className="absolute inset-0 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: pv / 100 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
                    style={{ background: `${accent}15` }}
                  />
                )}

                <div className="relative">
                  <p className="text-white font-bold text-sm leading-tight truncate">{opt.title}</p>
                  <p className="text-white/50 text-xs mt-0.5 truncate">{opt.artist}</p>

                  {voted && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-1.5"
                    >
                      <span className="font-display text-2xl leading-none" style={{ color: accent }}>{pv}%</span>
                      {isWinner && <span className="text-[9px] font-black" style={{ color: accent }}>↑ ganando</span>}
                      {isMine && <span className="text-[8px] font-bold text-white/30">tu voto</span>}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* CTA antes de votar */}
        {!voted && (
          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-white/30 text-[10px] mt-3"
          >
            Toca una opción para votar · El resultado es en vivo
          </motion.p>
        )}

        {/* Celebración post-voto */}
        <AnimatePresence>
          {justVoted && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => setTimeout(() => setJustVoted(false), 2000)}
              className="text-center text-[#db8918] text-xs font-semibold mt-2"
            >
              ¡Voto registrado! Resultados en tiempo real 🎵
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
