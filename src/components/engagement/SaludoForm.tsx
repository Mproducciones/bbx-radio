'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOTIVOS, type MotivoId } from '@/lib/saludoTypes'

type Step = 'motivo' | 'para' | 'de' | 'sending' | 'done' | 'error'

// ── Sonido "al aire" con Web Audio API ───────────────────────────────────────
function playOnAirSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const notes: [number, number][] = [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]]
    notes.forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + delay
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.18, t + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
      osc.start(t); osc.stop(t + 0.38)
    })
  } catch {}
}

// ── Canvas partículas emoji ───────────────────────────────────────────────────
function EmojiParticles({ emoji }: { emoji: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles = Array.from({ length: 22 }, () => ({
      x:  Math.random() * canvas.width,
      y:  canvas.height + 20,
      vy: -(2.5 + Math.random() * 3.5),
      vx: (Math.random() - 0.5) * 2,
      size: 18 + Math.random() * 22,
      alpha: 0.9 + Math.random() * 0.1,
      rot: (Math.random() - 0.5) * 0.15,
      angle: Math.random() * Math.PI * 2,
    }))

    let frame: number
    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = 0
      particles.forEach(p => {
        p.y     += p.vy
        p.x     += p.vx
        p.angle += p.rot
        p.alpha -= 0.008
        if (p.alpha <= 0) return
        alive++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(emoji, 0, 0)
        ctx.restore()
      })
      if (alive > 0) frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [emoji])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ── Ondas de radio animadas ───────────────────────────────────────────────────
function RadioWaves() {
  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: '#db8918', opacity: 0.6 }}
          animate={{ scaleY: [h, 1, h * 0.5, 1, h] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
          initial={{ scaleY: h, height: 32 }}
        />
      ))}
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export function SaludoForm() {
  const [step, setStep]       = useState<Step>('motivo')
  const [motivo, setMotivo]   = useState<MotivoId>('cumpleanos')
  const [para, setPara]       = useState('')
  const [mensaje, setMensaje] = useState('')
  const [de, setDe]           = useState('')
  const [errMsg, setErrMsg]   = useState('')

  const selected = MOTIVOS.find(m => m.id === motivo)!

  function pickMotivo(id: MotivoId) {
    setMotivo(id)
    setTimeout(() => setStep('para'), 280)
  }

  async function send() {
    setStep('sending')
    try {
      const res = await fetch('/api/saludos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ para, de, motivo, mensaje: mensaje || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error ?? 'Error al enviar'); setStep('error'); return }
      playOnAirSound()
      if (navigator.vibrate) navigator.vibrate([20, 80, 40, 80, 60])
      setStep('done')
    } catch { setErrMsg('Error de conexión'); setStep('error') }
  }

  function reset() {
    setPara(''); setMensaje(''); setDe('')
    setMotivo('cumpleanos'); setStep('motivo')
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? '-40%' : '40%', opacity: 0 }),
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)]">

      {/* Barra de progreso */}
      {!['sending', 'done', 'error'].includes(step) && (
        <div className="flex gap-1 mb-6 px-1">
          {(['motivo', 'para', 'de'] as Step[]).map((s, i) => (
            <motion.div
              key={s}
              className="h-0.5 flex-1 rounded-full"
              animate={{ background: ['motivo', 'para', 'de'].indexOf(step) >= i ? '#db8918' : 'rgba(255,255,255,0.1)' }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={1}>

        {/* ── STEP 1: Motivo ── */}
        {step === 'motivo' && (
          <motion.div key="motivo" custom={1} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="flex flex-col gap-5 flex-1"
          >
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Paso 1 de 3</p>
              <h2 className="font-display text-3xl text-white leading-tight">¿Qué ocasión es?</h2>
              <p className="text-white/30 text-sm mt-1">El locutor lo anunciará al aire</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {MOTIVOS.map(m => (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => pickMotivo(m.id)}
                  className="relative flex flex-col items-center justify-center gap-2 py-5 rounded-2xl overflow-hidden"
                  style={motivo === m.id
                    ? { background: 'rgba(219,137,24,0.15)', border: '2px solid rgba(219,137,24,0.5)', boxShadow: '0 0 20px rgba(219,137,24,0.15)' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {motivo === m.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: '#db8918' }}
                    >
                      <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </motion.div>
                  )}
                  <motion.span
                    className="text-4xl"
                    animate={motivo === m.id ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {m.emoji}
                  </motion.span>
                  <span className="text-xs font-semibold text-center leading-tight px-2"
                    style={{ color: motivo === m.id ? '#db8918' : 'rgba(255,255,255,0.55)' }}>
                    {m.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Para + Mensaje ── */}
        {step === 'para' && (
          <motion.div key="para" custom={1} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="flex flex-col gap-5 flex-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep('motivo')} className="text-white/30 hover:text-white transition-colors text-sm">← </button>
                <p className="text-white/40 text-xs uppercase tracking-widest">Paso 2 de 3</p>
              </div>
              <h2 className="font-display text-3xl text-white leading-tight">
                {selected.emoji} {selected.label}
              </h2>
              <p className="text-white/30 text-sm mt-1">¿Para quién es el saludo?</p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Para</span>
              <input
                value={para}
                onChange={e => setPara(e.target.value)}
                placeholder={
                  motivo === 'cumpleanos' ? 'ej: Mi mamá Rosa' :
                  motivo === 'aniversario' ? 'ej: Mi amor Carlos' :
                  motivo === 'apoyo' ? 'ej: Mi hermano Pedro' : 'ej: Mi abuela Luisa'
                }
                maxLength={80} autoFocus
                className="text-lg bg-transparent border-b-2 border-white/10 focus:border-[#db8918] py-2 text-white outline-none transition-colors placeholder-white/15"
              />
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Mensaje <span className="normal-case text-white/20">(opcional)</span></span>
                <span className="text-white/20 text-xs">{mensaje.length}/120</span>
              </div>
              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value.slice(0, 120))}
                placeholder="ej: Te queremos mucho, sos lo mejor de nuestra vida"
                rows={2}
                className="bg-white/[0.03] border border-white/[0.07] focus:border-[#db8918]/40 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none placeholder-white/15"
              />
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { if (para.trim()) setStep('de') }}
              disabled={!para.trim()}
              className="mt-auto w-full py-4 rounded-2xl font-bold text-base disabled:opacity-30 transition-all"
              style={{ background: para.trim() ? 'linear-gradient(135deg, #db8918, #a86611)' : 'rgba(255,255,255,0.06)', color: para.trim() ? '#07070E' : 'rgba(255,255,255,0.3)' }}
            >
              Continuar →
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 3: De + Preview ── */}
        {step === 'de' && (
          <motion.div key="de" custom={1} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="flex flex-col gap-5 flex-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep('para')} className="text-white/30 hover:text-white transition-colors text-sm">← </button>
                <p className="text-white/40 text-xs uppercase tracking-widest">Paso 3 de 3</p>
              </div>
              <h2 className="font-display text-3xl text-white leading-tight">¿De parte de quién?</h2>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">De parte de</span>
              <input
                value={de}
                onChange={e => setDe(e.target.value)}
                placeholder="Tu nombre o apodo"
                maxLength={60} autoFocus
                className="text-lg bg-transparent border-b-2 border-white/10 focus:border-[#db8918] py-2 text-white outline-none transition-colors placeholder-white/15"
              />
            </label>

            {/* Preview tarjeta como la ve el locutor */}
            <AnimatePresence>
              {de.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 relative overflow-hidden"
                  style={{ background: 'rgba(219,137,24,0.06)', border: '1px solid rgba(219,137,24,0.2)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #db8918, transparent)' }} />
                  <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest mb-2">📻 Así lo leerá el locutor</p>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{selected.emoji}</span>
                    <div>
                      <p className="text-white font-bold text-sm">Para <span className="text-[#db8918]">{para}</span></p>
                      {mensaje && <p className="text-white/60 text-xs mt-0.5 italic">"{mensaje}"</p>}
                      <p className="text-white/50 text-xs mt-1">— de parte de <span className="text-white">{de}</span></p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { if (de.trim()) send() }}
              disabled={!de.trim()}
              className="mt-auto w-full py-5 rounded-2xl font-bold text-base disabled:opacity-30 transition-all flex items-center justify-center gap-2"
              style={{ background: de.trim() ? 'linear-gradient(135deg, #db8918, #a86611)' : 'rgba(255,255,255,0.06)', color: de.trim() ? '#07070E' : 'rgba(255,255,255,0.3)' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm-2 15.5v-9l7 4.5-7 4.5z"/>
              </svg>
              Enviar saludo al aire
            </motion.button>
          </motion.div>
        )}

        {/* ── Enviando ── */}
        {step === 'sending' && (
          <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4">
            <RadioWaves />
            <div className="w-10 h-10 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-sm">Enviando al locutor...</p>
          </motion.div>
        )}

        {/* ── Éxito ── */}
        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 relative flex flex-col items-center justify-center gap-5 text-center overflow-hidden">

            <EmojiParticles emoji={selected.emoji} />

            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(219,137,24,0.15)', border: '2px solid rgba(219,137,24,0.3)' }}>
                <span className="text-5xl">{selected.emoji}</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ border: '2px solid #db8918' }}
              />
            </motion.div>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl text-white leading-none"
              >
                ¡Al aire!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-white/50 text-sm mt-2 leading-relaxed"
              >
                Tu saludo para <span className="text-white font-semibold">{para}</span><br/>
                de parte de <span className="text-white font-semibold">{de}</span><br/>
                ya está en la cola del locutor
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(219,137,24,0.1)', border: '1px solid rgba(219,137,24,0.2)' }}
            >
              <div className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
              <span className="text-[#db8918] text-xs font-semibold">Radio Bienvenida 93.3 FM</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={reset}
              className="text-white/25 text-xs underline hover:text-white/50 transition-colors"
            >
              Enviar otro saludo
            </motion.button>
          </motion.div>
        )}

        {/* ── Error ── */}
        {step === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <span className="text-5xl">📡</span>
            <p className="text-red-400 text-sm">{errMsg}</p>
            <button onClick={() => setStep('de')} className="text-white/40 text-xs border border-white/10 rounded-lg px-4 py-2 hover:text-white transition-colors">
              Intentar de nuevo
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
