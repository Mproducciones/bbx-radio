'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SongRequest } from '@/lib/songRequestStore'

type Phase = 'form' | 'sending' | 'success' | 'error'

interface SuccessState {
  request: SongRequest
  position: number
}

export function SongRequestForm({ compact, playful }: { compact?: boolean; playful?: boolean } = {}) {
  const [phase, setPhase]         = useState<Phase>('form')
  const [song, setSong]           = useState('')
  const [artist, setArtist]       = useState('')
  const [dedication, setDedication] = useState('')
  const [success, setSuccess]     = useState<SuccessState | null>(null)
  const [errorMsg, setErrorMsg]   = useState('')

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
      if (res.status === 429) { setErrorMsg('Demasiadas solicitudes. Espera unos minutos.'); setPhase('error'); return }
      if (!res.ok)            { setErrorMsg('No se pudo enviar. Intenta de nuevo.'); setPhase('error'); return }
      const created = await res.json() as SongRequest & { position?: number }
      setSuccess({ request: created, position: created.position ?? 0 })
      setPhase('success')
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 50, 20])
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.')
      setPhase('error')
    }
  }

  function reset() {
    setSong(''); setArtist(''); setDedication(''); setSuccess(null); setErrorMsg(''); setPhase('form')
  }

  const canSubmit = song.trim() && artist.trim()

  return (
    <div
      className="participa-panel overflow-hidden h-full flex flex-col relative"
      style={{
        background: playful
          ? 'linear-gradient(165deg, rgba(64,185,191,0.1) 0%, #0F0F1A 45%, #07070e 100%)'
          : '#0F0F1A',
        border: playful ? '1px solid rgba(64,185,191,0.3)' : '1px solid rgba(219,137,24,0.18)',
        boxShadow: playful ? '0 12px 36px -14px rgba(64,185,191,0.35)' : undefined,
      }}
    >
      {playful && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #40B9BF, #db8918, transparent)' }}
        />
      )}
      <div
        className={compact ? 'px-3.5 pt-2.5 pb-2' : 'px-5 pt-5 pb-4'}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`rounded-xl flex items-center justify-center ${compact ? 'w-9 h-9' : 'w-11 h-11'}`}
            style={{
              background: playful
                ? 'linear-gradient(135deg, rgba(64,185,191,0.35), rgba(219,137,24,0.25))'
                : 'linear-gradient(135deg, rgba(219,137,24,0.25), rgba(123,47,255,0.2))',
            }}
            animate={playful ? { scale: [1, 1.06, 1] } : undefined}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={compact ? 'text-lg' : 'text-xl'} aria-hidden>
              🎙️
            </span>
          </motion.div>
          <div>
            <p className={`text-white font-display leading-tight ${compact ? 'text-base' : 'text-lg'}`}>
              {playful ? '¡Al aire con tu tema!' : 'Pide tu canción'}
            </p>
            <p className="text-white/40 text-[10px]">
              {playful ? 'El locutor lo recibe en vivo' : 'Al aire en tu próximo turno'}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Form ── */}
        {phase === 'form' && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSubmit}
            className={
              compact
                ? 'px-3.5 py-2.5 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto overscroll-contain'
                : 'px-5 py-4 flex flex-col gap-3.5 flex-1 min-h-0 overflow-y-auto'
            }
          >
            <FieldInput
              label="Canción"
              required
              value={song}
              onChange={setSong}
              placeholder="ej: Amor Secreto"
              icon="🎵"
              compact={compact}
            />
            <FieldInput
              label="Artista"
              required
              value={artist}
              onChange={setArtist}
              placeholder="ej: Camilo"
              icon="🎤"
              compact={compact}
            />
            <FieldInput
              label="Dedicatoria"
              value={dedication}
              onChange={setDedication}
              placeholder="ej: Para María con todo mi amor"
              icon="💌"
              compact={compact}
              optional
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!canSubmit}
              className="participa-btn-primary mt-auto disabled:opacity-35 text-white relative overflow-hidden"
              style={{ background: canSubmit ? 'linear-gradient(135deg, #db8918, #7B2FFF)' : 'rgba(255,255,255,0.06)' }}
            >
              {canSubmit && (
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                />
              )}
              <span className="relative">{playful ? 'Mandar al locutor 🎵' : 'Enviar solicitud ♪'}</span>
            </motion.button>
          </motion.form>
        )}

        {/* ── Sending ── */}
        {phase === 'sending' && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-10"
          >
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-[#db8918]/20" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#db8918]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-3 rounded-full flex items-center justify-center text-xl">🎵</div>
            </div>
            <p className="text-white/50 text-sm">Enviando tu solicitud...</p>
          </motion.div>
        )}

        {/* ── Success ── */}
        {phase === 'success' && success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 px-5 py-6 flex flex-col items-center gap-4 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
              className="relative w-16 h-16"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(219,137,24,0.2), rgba(123,47,255,0.2))' }}
              >
                ✓
              </div>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid #db8918' }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-white font-bold text-base"
              >
                ¡Solicitud enviada!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-white/50 text-sm mt-1"
              >
                <span className="text-white font-semibold">{success.request.song}</span>
                {' '}de{' '}
                <span className="text-white font-semibold">{success.request.artist}</span>
              </motion.p>
            </div>

            {success.position > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl px-5 py-3.5 w-full"
                style={{ background: 'rgba(219,137,24,0.08)', border: '1px solid rgba(219,137,24,0.25)' }}
              >
                <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest">Tu posición en la cola</p>
                <p className="text-white font-display text-4xl leading-none mt-1">#{success.position}</p>
                <p className="text-white/40 text-xs mt-1">
                  {success.position === 1
                    ? '¡Eres el primero!'
                    : `${success.position - 1} ${success.position - 1 === 1 ? 'solicitud' : 'solicitudes'} antes`}
                </p>
              </motion.div>
            )}

            <button
              onClick={reset}
              className="text-white/30 text-xs underline underline-offset-2 hover:text-white/60 transition-colors"
            >
              Enviar otra solicitud
            </button>
          </motion.div>
        )}

        {/* ── Error ── */}
        {phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-5 py-6"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-sm">{errorMsg}</p>
            <button
              onClick={reset}
              className="text-sm font-semibold px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              Intentar de nuevo
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

// Reusable input field with icon
function FieldInput({
  label, value, onChange, placeholder, icon, required, optional, compact,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder: string; icon: string; required?: boolean; optional?: boolean; compact?: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <span>{icon}</span> {label}
          {required && <span className="text-[#db8918]">*</span>}
        </span>
        {optional && <span className="text-white/25 text-[10px]">opcional</span>}
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={required ? 120 : 200}
        className="participa-input"
        style={{ caretColor: '#db8918', '--input-accent': '#db8918' } as React.CSSProperties}
      />
    </label>
  )
}

