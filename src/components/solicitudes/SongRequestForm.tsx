'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SongRequest } from '@/lib/songRequestStore'

type Phase = 'form' | 'sending' | 'success' | 'error'

interface SuccessState {
  request: SongRequest
  position: number
}

export function SongRequestForm() {
  const [phase, setPhase] = useState<Phase>('form')
  const [song, setSong] = useState('')
  const [artist, setArtist] = useState('')
  const [dedication, setDedication] = useState('')
  const [success, setSuccess] = useState<SuccessState | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!song.trim() || !artist.trim()) return
    setPhase('sending')

    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song: song.trim(), artist: artist.trim(), dedication: dedication.trim() || undefined }),
      })

      if (res.status === 429) {
        setErrorMsg('Demasiadas solicitudes. Espera unos minutos.')
        setPhase('error')
        return
      }
      if (!res.ok) {
        setErrorMsg('No se pudo enviar. Intenta de nuevo.')
        setPhase('error')
        return
      }

      const created: SongRequest = await res.json()
      // Get queue to determine position
      const queueRes = await fetch('/api/solicitudes')
      const queue: SongRequest[] = await queueRes.json()
      const pending = queue.filter(r => r.status === 'pending')
      const pos = pending.findIndex(r => r.id === created.id) + 1

      setSuccess({ request: created, position: pos })
      setPhase('success')
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 50, 20])
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.')
      setPhase('error')
    }
  }

  function reset() {
    setSong('')
    setArtist('')
    setDedication('')
    setSuccess(null)
    setErrorMsg('')
    setPhase('form')
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0F0F1A', border: '1px solid rgba(219,137,24,0.15)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #db891833, #7B2FFF33)' }}>
            <MicIcon className="w-5 h-5 text-[#db8918]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Pide tu canción</p>
            <p className="text-[#666690] text-xs">Al locutor en directo</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'form' && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="px-5 py-4 flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1">
              <span className="text-[#8888AA] text-xs font-medium">Canción *</span>
              <input
                value={song}
                onChange={e => setSong(e.target.value)}
                placeholder="ej: Amor Secreto"
                required
                maxLength={120}
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#db8918] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-[#444468]"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[#8888AA] text-xs font-medium">Artista *</span>
              <input
                value={artist}
                onChange={e => setArtist(e.target.value)}
                placeholder="ej: Camilo"
                required
                maxLength={80}
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#db8918] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-[#444468]"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[#8888AA] text-xs font-medium">Dedicatoria <span className="text-[#444468]">(opcional)</span></span>
              <input
                value={dedication}
                onChange={e => setDedication(e.target.value)}
                placeholder="ej: Para María con todo mi amor"
                maxLength={200}
                className="bg-[#07070E] border border-[#1A1A2E] focus:border-[#db8918] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-[#444468]"
              />
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!song.trim() || !artist.trim()}
              className="w-full py-3 rounded-xl font-bold text-sm text-white mt-1 disabled:opacity-40 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #db8918, #7B2FFF)' }}
            >
              Enviar solicitud
            </motion.button>
          </motion.form>
        )}

        {phase === 'sending' && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 py-10 flex flex-col items-center gap-3"
          >
            <div className="w-8 h-8 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8888AA] text-sm">Enviando tu solicitud...</p>
          </motion.div>
        )}

        {phase === 'success' && success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-6 flex flex-col items-center gap-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #db891833, #7B2FFF33)' }}
            >
              <CheckIcon className="w-8 h-8 text-[#db8918]" />
            </motion.div>

            <div>
              <p className="text-white font-bold text-base">¡Solicitud enviada!</p>
              <p className="text-[#8888AA] text-sm mt-1">
                <span className="font-semibold text-white">{success.request.song}</span> de{' '}
                <span className="font-semibold text-white">{success.request.artist}</span>
              </p>
            </div>

            {success.position > 0 && (
              <div className="rounded-xl px-4 py-3 w-full" style={{ background: 'rgba(219,137,24,0.08)', border: '1px solid rgba(219,137,24,0.2)' }}>
                <p className="text-[#db8918] text-xs font-semibold uppercase tracking-wide">Tu posición en la cola</p>
                <p className="text-white text-3xl font-display leading-none mt-1">#{success.position}</p>
                {success.position === 1 && (
                  <p className="text-[#8888AA] text-xs mt-1">¡Eres el primero!</p>
                )}
                {success.position > 1 && (
                  <p className="text-[#8888AA] text-xs mt-1">{success.position - 1} {success.position - 1 === 1 ? 'solicitud' : 'solicitudes'} antes que la tuya</p>
                )}
              </div>
            )}

            <button
              onClick={reset}
              className="text-[#666690] text-xs underline underline-offset-2 hover:text-white transition-colors"
            >
              Enviar otra solicitud
            </button>
          </motion.div>
        )}

        {phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 py-6 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-sm">{errorMsg}</p>
            <button
              onClick={reset}
              className="text-white text-sm font-medium underline underline-offset-2"
            >
              Intentar de nuevo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 15.2 14.47 17 12 17s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
  )
}
