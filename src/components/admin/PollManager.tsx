'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Poll {
  id: string
  question: string
  options: [{ id: string; title: string; artist: string; votes: number }, { id: string; title: string; artist: string; votes: number }]
  active: boolean
  totalVotes: number
}

// Sugerencias rápidas para el locutor
const QUICK_POLLS = [
  { question: '¿Cuál quieres que suene ahora?', a: { title: 'Hawái', artist: 'Maluma' }, b: { title: 'Tusa', artist: 'KAROL G' } },
  { question: '¿Qué ritmo prefieres esta tarde?', a: { title: 'Cumbia', artist: 'Género' }, b: { title: 'Reggaeton', artist: 'Género' } },
  { question: '¿Quién tiene el mejor hit del 2025?', a: { title: 'Bad Bunny', artist: 'Artista' }, b: { title: 'Shakira', artist: 'Artista' } },
  { question: '¿Qué era favorita prefieres?', a: { title: 'Los 90', artist: 'Hits retro' }, b: { title: 'Los 2000', artist: 'Hits retro' } },
]

export function PollManager() {
  const [poll, setPoll]     = useState<Poll | null>(null)
  const [mode, setMode]     = useState<'view' | 'create'>('view')
  const [question, setQuestion] = useState('')
  const [titleA, setTitleA] = useState('')
  const [artistA, setArtistA] = useState('')
  const [titleB, setTitleB] = useState('')
  const [artistB, setArtistB] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/poll', { headers: { 'x-session-id': 'admin' } })
      .then(r => r.json()).then(setPoll).catch(() => {})
    const t = setInterval(() =>
      fetch('/api/poll', { headers: { 'x-session-id': 'admin' } })
        .then(r => r.json()).then(setPoll).catch(() => {}),
      6_000
    )
    return () => clearInterval(t)
  }, [])

  function fillQuick(q: typeof QUICK_POLLS[0]) {
    setQuestion(q.question); setTitleA(q.a.title); setArtistA(q.a.artist)
    setTitleB(q.b.title); setArtistB(q.b.artist)
  }

  async function createPoll(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/poll', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question, optionA: { title: titleA, artist: artistA }, optionB: { title: titleB, artist: artistB } }),
      })
      const data = await res.json()
      if (data.poll) { setPoll(data.poll); setMode('view') }
    } catch {} finally { setSaving(false) }
  }

  async function closePoll() {
    await fetch('/api/poll', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ action: 'close' }) })
    setPoll(prev => prev ? { ...prev, active: false } : null)
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wider">Votación de canciones</p>
        <button
          onClick={() => setMode(m => m === 'view' ? 'create' : 'view')}
          className="text-xs font-bold px-3 py-1 rounded-lg"
          style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}
        >
          {mode === 'view' ? '+ Nueva votación' : '← Cancelar'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'view' ? (
          <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {poll ? (
              <div className="rounded-xl p-4" style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${poll.active ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                  <p className="text-white/60 text-xs">{poll.active ? 'Activa ahora' : 'Cerrada'}</p>
                  <span className="ml-auto text-white/30 text-[10px]">{poll.totalVotes} votos</span>
                </div>
                <p className="text-white text-sm font-semibold mb-3">{poll.question}</p>
                {poll.options.map(opt => {
                  const pv = poll.totalVotes === 0 ? 50 : Math.round((opt.votes / poll.totalVotes) * 100)
                  const color = opt.id === 'a' ? '#db8918' : '#40B9BF'
                  return (
                    <div key={opt.id} className="mb-2">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-white/60 text-xs">{opt.title} · {opt.artist}</span>
                        <span className="text-xs font-bold" style={{ color }}>{pv}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pv}%`, background: color }} />
                      </div>
                    </div>
                  )
                })}
                {poll.active && (
                  <button onClick={closePoll} className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors">
                    Cerrar votación
                  </button>
                )}
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-4">No hay votación activa. Crea una para activarla en la app.</p>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="create"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={createPoll}
            className="flex flex-col gap-3"
          >
            {/* Quick fills */}
            <div className="flex flex-wrap gap-2">
              {QUICK_POLLS.map((q, i) => (
                <button key={i} type="button" onClick={() => fillQuick(q)}
                  className="text-[10px] px-2 py-1 rounded-lg text-white/50 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  Duelo {i + 1}
                </button>
              ))}
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-white/40 text-xs">Pregunta</span>
              <input value={question} onChange={e => setQuestion(e.target.value)} required
                placeholder="¿Cuál quieres que suene?" maxLength={80}
                className="bg-white/[0.04] border border-white/[0.08] focus:border-[#db8918] rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors placeholder-white/20" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-[#db8918] text-xs font-bold">Opción A</span>
                <input value={titleA} onChange={e => setTitleA(e.target.value)} required placeholder="Canción" maxLength={60}
                  className="bg-white/[0.04] border border-[#db8918]/20 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#db8918] transition-colors placeholder-white/20" />
                <input value={artistA} onChange={e => setArtistA(e.target.value)} required placeholder="Artista" maxLength={40}
                  className="bg-white/[0.04] border border-[#db8918]/20 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#db8918] transition-colors placeholder-white/20" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[#40B9BF] text-xs font-bold">Opción B</span>
                <input value={titleB} onChange={e => setTitleB(e.target.value)} required placeholder="Canción" maxLength={60}
                  className="bg-white/[0.04] border border-[#40B9BF]/20 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#40B9BF] transition-colors placeholder-white/20" />
                <input value={artistB} onChange={e => setArtistB(e.target.value)} required placeholder="Artista" maxLength={40}
                  className="bg-white/[0.04] border border-[#40B9BF]/20 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#40B9BF] transition-colors placeholder-white/20" />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="py-2.5 rounded-xl font-bold text-sm text-[#07070E] disabled:opacity-50 transition-opacity"
              style={{ background: '#db8918' }}>
              {saving ? 'Activando...' : 'Activar votación en la app →'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
