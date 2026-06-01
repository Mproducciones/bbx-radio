'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOTIVOS, type MotivoId } from '@/lib/saludoTypes'

type Phase = 'form' | 'sending' | 'done' | 'error'

export function SaludoForm() {
  const [phase, setPhase] = useState<Phase>('form')
  const [motivo, setMotivo] = useState<MotivoId>('cumpleanos')
  const [para, setPara]     = useState('')
  const [de, setDe]         = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cancion, setCancion] = useState('')
  const [artista, setArtista] = useState('')
  const [errMsg, setErrMsg]   = useState('')
  const [showCancion, setShowCancion] = useState(false)

  const selectedMotivo = MOTIVOS.find(m => m.id === motivo)!

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!para.trim() || !de.trim()) return
    setPhase('sending')

    try {
      const res = await fetch('/api/saludos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ para, de, motivo, mensaje: mensaje || undefined, cancion: cancion || undefined, artista: artista || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error ?? 'Error al enviar'); setPhase('error'); return }
      setPhase('done')
      if (navigator.vibrate) navigator.vibrate([10, 60, 20])
    } catch { setErrMsg('Error de conexión'); setPhase('error') }
  }

  function reset() {
    setPara(''); setDe(''); setMensaje(''); setCancion(''); setArtista('')
    setMotivo('cumpleanos'); setShowCancion(false); setPhase('form')
  }

  return (
    <AnimatePresence mode="wait">
      {phase === 'form' && (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          onSubmit={submit}
          className="flex flex-col gap-4"
        >
          {/* Motivo */}
          <div>
            <p className="text-white/40 text-xs mb-2">¿Por qué escribís?</p>
            <div className="grid grid-cols-3 gap-2">
              {MOTIVOS.map(m => (
                <motion.button
                  key={m.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMotivo(m.id)}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all"
                  style={motivo === m.id
                    ? { background: 'rgba(219,137,24,0.15)', border: '1px solid rgba(219,137,24,0.4)', color: '#db8918' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
                  }
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="leading-tight text-center">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Para */}
          <label className="flex flex-col gap-1.5">
            <span className="text-white/40 text-xs">¿Para quién va el saludo?</span>
            <input
              value={para}
              onChange={e => setPara(e.target.value)}
              placeholder={`ej: Mi mamá Rosa, ${motivo === 'aniversario' ? 'mi amor Carlos' : motivo === 'apoyo' ? 'mi hermano Pedro' : 'mi abuela Luisa'}`}
              required maxLength={80}
              className="bg-white/[0.04] border border-white/[0.08] focus:border-[#db8918] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-white/20"
            />
          </label>

          {/* Mensaje */}
          <label className="flex flex-col gap-1.5">
            <span className="text-white/40 text-xs">Tu mensaje <span className="text-white/20">(opcional · {120 - mensaje.length} caracteres)</span></span>
            <input
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              placeholder="ej: Te queremos mucho, sos lo mejor de nuestra vida"
              maxLength={120}
              className="bg-white/[0.04] border border-white/[0.08] focus:border-[#db8918] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-white/20"
            />
          </label>

          {/* De parte de */}
          <label className="flex flex-col gap-1.5">
            <span className="text-white/40 text-xs">De parte de</span>
            <input
              value={de}
              onChange={e => setDe(e.target.value)}
              placeholder="Tu nombre o apodo"
              required maxLength={60}
              className="bg-white/[0.04] border border-white/[0.08] focus:border-[#db8918] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-white/20"
            />
          </label>

          {/* Canción opcional */}
          <div>
            <button
              type="button"
              onClick={() => setShowCancion(v => !v)}
              className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              <span>{showCancion ? '▾' : '▸'}</span>
              {showCancion ? 'Sin canción' : '+ Agregar canción'}
            </button>

            <AnimatePresence>
              {showCancion && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                  className="mt-3 flex flex-col gap-2"
                >
                  <input
                    value={cancion}
                    onChange={e => setCancion(e.target.value)}
                    placeholder="Nombre de la canción"
                    maxLength={100}
                    className="bg-white/[0.04] border border-white/[0.08] focus:border-[#db8918] rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder-white/20"
                  />
                  <input
                    value={artista}
                    onChange={e => setArtista(e.target.value)}
                    placeholder="Artista"
                    maxLength={80}
                    className="bg-white/[0.04] border border-white/[0.08] focus:border-[#db8918] rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder-white/20"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!para.trim() || !de.trim()}
            className="w-full py-4 rounded-2xl font-bold text-base text-[#07070E] disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #db8918, #a86611)' }}
          >
            {selectedMotivo.emoji} Enviar saludo al aire
          </motion.button>
        </motion.form>
      )}

      {phase === 'sending' && (
        <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="py-12 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Enviando tu saludo...</p>
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="py-8 flex flex-col items-center gap-5 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-6xl"
          >
            {selectedMotivo.emoji}
          </motion.div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              ¡Saludo enviado!
            </p>
            <p className="text-white/50 text-sm mt-1.5 leading-relaxed">
              Para <span className="text-white font-medium">{para}</span>
              <br />de parte de <span className="text-white font-medium">{de}</span>
            </p>
          </div>
          <p className="text-white/25 text-xs leading-relaxed max-w-xs">
            El locutor lo leerá al aire cuando tenga el momento. ¡Seguí escuchando!
          </p>
          <button onClick={reset} className="text-white/30 text-xs underline hover:text-white/60 transition-colors">
            Enviar otro saludo
          </button>
        </motion.div>
      )}

      {phase === 'error' && (
        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="py-8 flex flex-col items-center gap-3 text-center">
          <p className="text-red-400 text-sm">{errMsg}</p>
          <button onClick={() => setPhase('form')} className="text-white/40 text-xs underline">
            Intentar de nuevo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
