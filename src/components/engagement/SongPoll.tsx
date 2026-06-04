'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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

function VoteBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const glyphs = ['🎵', '✨', '🔥', '⭐', '🎶']
    const particles = Array.from({ length: 18 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 40,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: -(3 + Math.random() * 5),
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)]!,
      size: 14 + Math.random() * 12,
      alpha: 1,
      rot: (Math.random() - 0.5) * 0.2,
      angle: Math.random() * Math.PI * 2,
    }))

    let frame: number
    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = 0
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.12
        p.angle += p.rot
        p.alpha -= 0.028
        if (p.alpha <= 0) return
        alive++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.glyph, 0, 0)
        ctx.restore()
      })
      if (alive > 0) frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
}

function VinylDisc({ color, spinning }: { color: string; spinning: boolean }) {
  return (
    <motion.div
      className="w-10 h-10 rounded-full shrink-0 relative mx-auto mb-2"
      style={{
        background: `conic-gradient(from 0deg, ${color}44, #07070e 40%, ${color}22 70%, #07070e)`,
        border: `2px solid ${color}66`,
        boxShadow: `0 0 16px ${color}33`,
      }}
      animate={spinning ? { rotate: 360 } : { rotate: 0 }}
      transition={spinning ? { duration: 4, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
    >
      <div
        className="absolute inset-[30%] rounded-full"
        style={{ background: '#07070e', border: `1px solid ${color}40` }}
      />
    </motion.div>
  )
}

export function SongPoll({
  compact,
  onEmpty,
  className,
}: {
  compact?: boolean
  onEmpty?: () => void
  className?: string
} = {}) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [justVoted, setJustVoted] = useState(false)
  const [burst, setBurst] = useState(false)

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch('/api/poll', { credentials: 'include' })
      const data = await res.json()
      setPoll(data)
    } catch {
      setPoll(null)
    } finally {
      setLoading(false)
    }
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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      })
      const data = await res.json()
      if (data.poll) {
        setPoll({ ...data.poll, myVote: optionId })
        setJustVoted(true)
        setBurst(true)
        setTimeout(() => setBurst(false), 1200)
      }
      if (navigator.vibrate) navigator.vibrate([12, 50, 25])
    } catch {
      /* ignore */
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div
        className={`flex flex-1 flex-col min-h-0 rounded-2xl p-4 gap-3 ${className ?? ''}`}
        style={{
          background: 'linear-gradient(165deg, rgba(219,137,24,0.08) 0%, rgba(15,15,26,0.9) 45%, #07070e 100%)',
          border: '1px solid rgba(219,137,24,0.2)',
        }}
        aria-busy="true"
        aria-label="Cargando votación"
      >
        <div className="flex justify-center gap-1 h-10 items-end">
          {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.75].map((h, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-[#db8918]/40"
              style={{ height: 28 }}
              animate={{ scaleY: [h, 1, h * 0.5] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
        <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest">Armando la batalla…</p>
      </div>
    )
  }

  if (!poll || !poll.active) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-1 flex-col items-center justify-center rounded-2xl p-5 text-center gap-4 min-h-0 ${className ?? ''}`}
        style={{
          background: 'linear-gradient(160deg, rgba(64,185,191,0.1) 0%, rgba(15,15,26,0.92) 50%, #07070e 100%)',
          border: '1px solid rgba(64,185,191,0.25)',
        }}
      >
        <motion.span
          className="text-4xl"
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          🎧
        </motion.span>
        <div>
          <p className="font-display text-xl text-white leading-tight">Sin batalla ahora</p>
          <p className="text-white/45 text-xs mt-1.5 max-w-[220px] mx-auto">
            Cuando el locutor abra la votación, el duelo aparece acá al instante.
          </p>
        </div>
        {onEmpty && (
          <motion.button
            type="button"
            onClick={onEmpty}
            whileTap={{ scale: 0.96 }}
            className="text-xs font-bold px-5 py-3 rounded-xl text-[#07070e]"
            style={{
              background: 'linear-gradient(135deg, #40B9BF, #db8918)',
              boxShadow: '0 8px 24px rgba(64,185,191,0.35)',
            }}
          >
            Pedir canción al locutor →
          </motion.button>
        )}
      </motion.div>
    )
  }

  const voted = !!poll.myVote
  const [a, b] = poll.options
  const pA = pct(a.votes, poll.totalVotes)
  const pB = pct(b.votes, poll.totalVotes)
  const winner = voted && a.votes !== b.votes ? (a.votes > b.votes ? a.id : b.id) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`participa-panel relative overflow-hidden h-full flex flex-col min-h-0 ${className ?? ''}`}
      style={{
        background: 'linear-gradient(165deg, rgba(219,137,24,0.12) 0%, rgba(15,15,26,0.95) 40%, #07070e 100%)',
        border: '1px solid rgba(219,137,24,0.28)',
        boxShadow: '0 12px 40px -16px rgba(219,137,24,0.35)',
      }}
    >
      <VoteBurst active={burst} />
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #db8918, #40B9BF, #7D59B5, transparent)' }}
      />

      <div className={compact ? 'p-3 flex-1 flex flex-col min-h-0 relative z-[1]' : 'p-4 flex-1 flex flex-col'}>
        <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
          <motion.span
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <p className="text-[#db8918] text-[9px] font-black uppercase tracking-[0.2em]">Batalla de temas</p>
          {poll.totalVotes > 0 && (
            <span className="ml-auto text-white/35 text-[9px] tabular-nums">
              {poll.totalVotes} voto{poll.totalVotes !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className={`text-white font-display leading-tight ${compact ? 'text-base mb-3' : 'text-lg mb-4'}`}>
          {poll.question}
        </p>

        <div className={`flex-1 min-h-0 grid grid-cols-[1fr_auto_1fr] items-stretch ${compact ? 'gap-1' : 'gap-2'}`}>
          {([a, b] as const).map((opt, idx) => {
            const pv = opt.id === a.id ? pA : pB
            const isWinner = winner === opt.id
            const isMine = poll.myVote === opt.id
            const isOther = voted && !isMine
            const accent = opt.id === a.id ? '#db8918' : '#40B9BF'
            const gridCol = idx === 0 ? 'col-start-1' : 'col-start-3'

            return (
              <motion.button
                key={opt.id}
                whileTap={voted ? {} : { scale: 0.94 }}
                onClick={() => castVote(opt.id)}
                disabled={voted || voting}
                className={`participa-vote-card ${gridCol} row-start-1 relative overflow-hidden text-center flex flex-col justify-end ${compact ? 'p-2 pt-2.5' : 'p-3 min-h-[8.5rem]'}`}
                style={{
                  background: isMine
                    ? `linear-gradient(180deg, ${accent}28 0%, rgba(7,7,14,0.9) 100%)`
                    : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isMine ? accent + '70' : 'rgba(255,255,255,0.08)'}`,
                  opacity: isOther ? 0.55 : 1,
                  cursor: voted ? 'default' : 'pointer',
                }}
              >
                {voted && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 origin-bottom"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: pv / 100 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26, delay: idx * 0.05 }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(0deg, ${accent}35 0%, transparent 85%)`,
                    }}
                  />
                )}

                <div className="relative z-[1]">
                  <VinylDisc color={accent} spinning={!voted && !voting} />
                  <p className="text-white font-bold text-xs leading-tight line-clamp-2">{opt.title}</p>
                  <p className="text-white/45 text-[10px] mt-0.5 truncate">{opt.artist}</p>

                  {voted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 flex flex-col items-center gap-0.5"
                    >
                      <span className="font-display text-2xl leading-none" style={{ color: accent }}>
                        {pv}%
                      </span>
                      {isWinner && (
                        <span className="text-[8px] font-black uppercase" style={{ color: accent }}>
                          Ganando
                        </span>
                      )}
                      {isMine && <span className="text-[7px] text-white/35">Tu voto</span>}
                    </motion.div>
                  ) : (
                    <motion.p
                      className="text-[8px] font-bold mt-2 uppercase tracking-wide"
                      style={{ color: accent }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      Toca para votar
                    </motion.p>
                  )}
                </div>
              </motion.button>
            )
          })}

          <div
            className="col-start-2 row-start-1 flex items-center justify-center self-center shrink-0 w-10 pointer-events-none z-[2]"
            aria-hidden
          >
            <motion.div
              className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[10px] text-white"
              style={{
                background: '#07070e',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 0 16px rgba(219,137,24,0.35)',
              }}
              animate={!voted ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 1.5, repeat: voted ? 0 : Infinity }}
            >
              VS
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {justVoted && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => setTimeout(() => setJustVoted(false), 2200)}
              className="text-center text-[#00D9A0] text-[10px] font-bold mt-2 uppercase tracking-wide"
            >
              ¡Voto al aire! Resultados en vivo
            </motion.p>
          )}
        </AnimatePresence>

        {!voted && !compact && (
          <motion.p
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="text-center text-white/25 text-[9px] mt-2"
          >
            Elige tu favorito — solo un voto por batalla
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
