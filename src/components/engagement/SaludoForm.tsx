'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOTIVOS, type MotivoId } from '@/lib/saludoTypes'
import { SaludoMotivoIcon } from '@/components/engagement/SaludoMotivoIcon'
import { EASE_OUT, springSnappy, staggerContainer, staggerItem } from '@/lib/motion/framer'
import { Plus, RotateCcw } from 'lucide-react'
import { animateStagger } from '@/lib/motion/anime'

type Step = 'motivo' | 'para' | 'de' | 'sending' | 'done' | 'error'

const STEPS: Step[] = ['motivo', 'para', 'de']

async function playOnAirSound() {
  try {
    const Ctx = window.AudioContext
      || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    if (ctx.state === 'suspended') await ctx.resume()
    const notes: [number, number][] = [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]]
    notes.forEach(([freq, delay]) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + delay
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.16, t + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
      osc.start(t)
      osc.stop(t + 0.38)
    })
  } catch { /* audio opcional */ }
}

function AirBurstParticles({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const particles = Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.4
      const speed = 2 + Math.random() * 4
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.5 + Math.random() * 2.5,
        alpha: 1,
        life: 0.55 + Math.random() * 0.35,
      }
    })

    let frame: number
    const start = performance.now()

    function draw(now: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = 0
      const t = (now - start) / 1000
      particles.forEach(p => {
        if (t > p.life) return
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.alpha = 1 - t / p.life
        if (p.alpha <= 0) return
        alive++
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.alpha * 0.85
        ctx.fill()
      })
      ctx.globalAlpha = 1
      if (alive > 0) frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [color])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
}

function RadioWaves() {
  return (
    <div className="flex items-end justify-center gap-1 h-8" aria-hidden>
      {[0.35, 0.7, 1, 0.65, 0.4].map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full origin-bottom"
          style={{ background: '#db8918', height: 28, opacity: 0.65 }}
          animate={{ scaleY: [h, 1.1, h * 0.45, 1, h] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

const slideVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, x: 0 },
  exit: { opacity: 0, y: -6, x: 0 },
}

export function SaludoForm({ compact }: { compact?: boolean } = {}) {
  const [step, setStep] = useState<Step>('motivo')
  const [motivo, setMotivo] = useState<MotivoId>('cumpleanos')
  const [para, setPara] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [de, setDe] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)

  const selected = MOTIVOS.find(m => m.id === motivo)!
  const stepIndex = STEPS.indexOf(step as typeof STEPS[number])

  function pickMotivo(id: MotivoId) {
    setMotivo(id)
    const card = gridRef.current?.querySelector(`[data-motivo="${id}"]`) as HTMLElement | null
    if (card) {
      void import('animejs').then(({ animate }) => {
        animate(card, {
          scale: [1, 1.04, 1],
          duration: 420,
          ease: 'spring(1, 90, 14, 0)',
        })
      })
    }
    setTimeout(() => setStep('para'), 320)
  }

  useEffect(() => {
    if (step !== 'motivo' || !gridRef.current) return
    const el = gridRef.current
    const t = requestAnimationFrame(() => {
      void animateStagger(el, '[data-motivo]', {
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.94, 1],
        duration: 560,
        staggerMs: 70,
        ease: 'out(3)',
      })
    })
    return () => cancelAnimationFrame(t)
  }, [step])

  async function send() {
    setStep('sending')
    try {
      const res = await fetch('/api/saludos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ para, de, motivo, mensaje: mensaje || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error ?? 'Error al enviar')
        setStep('error')
        return
      }
      playOnAirSound()
      if (navigator.vibrate) navigator.vibrate([20, 80, 40, 80, 60])
      setStep('done')
    } catch {
      setErrMsg('Error de conexión')
      setStep('error')
    }
  }

  function reset() {
    setPara('')
    setMensaje('')
    setDe('')
    setMotivo('cumpleanos')
    setStep('motivo')
  }

  const accent = selected.color

  return (
    <div
      className={`saludos-form ${compact ? 'saludos-form--compact' : ''}`}
      style={{ '--input-accent': accent } as CSSProperties}
    >
      {!['sending', 'done', 'error'].includes(step) && (
        <div className="saludos-progress shrink-0" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={3}>
          {STEPS.map((s, i) => (
            <div key={s} className="saludos-progress__seg">
              <motion.div
                className="saludos-progress__fill"
                initial={false}
                animate={{ scaleX: stepIndex >= i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="saludos-form__steps flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
      <AnimatePresence mode="wait">
        {step === 'motivo' && (
          <motion.div
            key="motivo"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springSnappy}
            className="flex flex-col flex-1 min-h-0 min-w-0 gap-3 w-full"
          >
            <div>
              <p className="saludos-step-title">Paso 1 de 3</p>
              <h2 className="saludos-step-heading">¿Qué ocasión es?</h2>
            </div>

            <div ref={gridRef} className="saludos-motivo-grid">
              {MOTIVOS.map(m => {
                const active = motivo === m.id
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    data-motivo={m.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => pickMotivo(m.id)}
                    className={`saludos-motivo-card ${active ? 'is-active' : ''}`}
                    style={{
                      '--motivo-color': m.color,
                      '--motivo-glow': m.glow,
                    } as CSSProperties}
                  >
                    {active && (
                      <motion.span
                        className="saludos-motivo-card__check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={springSnappy}
                        aria-hidden
                      >
                        <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </motion.span>
                    )}
                    <span className="saludos-motivo-card__icon-wrap relative z-[1]">
                      <SaludoMotivoIcon id={m.id} className="saludos-motivo-card__icon" />
                    </span>
                    <span className="saludos-motivo-card__label relative z-[1]">{m.label}</span>
                    <span className="saludos-motivo-card__tag relative z-[1]">{m.tagline}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 'para' && (
          <motion.div
            key="para"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springSnappy}
            className="flex flex-col flex-1 min-h-0 min-w-0 gap-3 w-full"
          >
            <div className="flex items-start gap-2 min-w-0 w-full">
              <button type="button" onClick={() => setStep('motivo')} className="saludos-back shrink-0" aria-label="Volver">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <p className="saludos-step-title">Paso 2 de 3</p>
                <h2 className="saludos-step-heading flex items-center gap-2 min-w-0">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}40` }}
                  >
                    <SaludoMotivoIcon id={motivo} className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 truncate">{selected.label}</span>
                </h2>
              </div>
            </div>

            <motion.div
              variants={{ initial: {}, animate: staggerContainer.animate }}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-3 flex-1 min-w-0 w-full"
            >
              <motion.label variants={staggerItem} className="flex flex-col gap-1.5 min-w-0 w-full">
                <span className="saludos-label">Para</span>
                <input
                  value={para}
                  onChange={e => setPara(e.target.value)}
                  placeholder={
                    motivo === 'cumpleanos' ? 'Ej: Mi mamá Rosa' :
                    motivo === 'aniversario' ? 'Ej: Mi amor Carlos' :
                    motivo === 'apoyo' ? 'Ej: Mi hermano Pedro' : 'Ej: Mi abuela Luisa'
                  }
                  maxLength={80}
                  autoFocus
                  className="saludos-input saludos-input--line text-lg"
                />
              </motion.label>

              <motion.label variants={staggerItem} className="flex flex-col gap-1.5 min-w-0 w-full">
                <div className="flex justify-between items-baseline gap-2 min-w-0">
                  <span className="saludos-label">
                    Mensaje <span className="normal-case font-semibold text-white/25">(opcional)</span>
                  </span>
                  <span className="text-[10px] text-white/25 tabular-nums">{mensaje.length}/120</span>
                </div>
                <textarea
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value.slice(0, 120))}
                  placeholder="Ej: Te queremos mucho, eres lo mejor de nuestra vida"
                  rows={3}
                  className="saludos-input saludos-textarea text-sm"
                />
              </motion.label>

              <motion.button
                variants={staggerItem}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => { if (para.trim()) setStep('de') }}
                disabled={!para.trim()}
                className={`saludos-btn mt-auto ${para.trim() ? 'is-ready' : 'is-disabled'}`}
              >
                Continuar
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 'de' && (
          <motion.div
            key="de"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springSnappy}
            className="flex flex-col flex-1 min-h-0 min-w-0 gap-3 w-full"
          >
            <div className="flex items-start gap-2 min-w-0 w-full">
              <button type="button" onClick={() => setStep('para')} className="saludos-back shrink-0" aria-label="Volver">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <p className="saludos-step-title">Paso 3 de 3</p>
                <h2 className="saludos-step-heading">¿De parte de quién?</h2>
              </div>
            </div>

            <label className="flex flex-col gap-1.5 min-w-0 w-full">
              <span className="saludos-label">De parte de</span>
              <input
                value={de}
                onChange={e => setDe(e.target.value)}
                placeholder="Tu nombre o apodo"
                maxLength={60}
                autoFocus
                className="saludos-input saludos-input--line text-lg"
              />
            </label>

            <AnimatePresence>
              {de.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="saludos-preview"
                >
                  <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest mb-2">
                    Vista previa · cabina
                  </p>
                  <div className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}35` }}
                    >
                      <SaludoMotivoIcon id={motivo} className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm">
                        Para <span style={{ color: accent }}>{para}</span>
                      </p>
                      {mensaje && (
                        <p className="text-white/55 text-xs mt-0.5 italic leading-relaxed">&ldquo;{mensaje}&rdquo;</p>
                      )}
                      <p className="text-white/45 text-xs mt-1">
                        — de parte de <span className="text-white">{de}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => { if (de.trim()) send() }}
              disabled={!de.trim()}
              className={`saludos-btn mt-auto ${de.trim() ? 'is-ready' : 'is-disabled'}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
                <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm-2 15.5v-9l7 4.5-7 4.5z" />
              </svg>
              Enviar saludo al aire
            </motion.button>
          </motion.div>
        )}

        {step === 'sending' && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            <RadioWaves />
            <div className="w-10 h-10 border-2 border-[#db8918] border-t-transparent rounded-full animate-spin" aria-hidden />
            <p className="text-white/40 text-sm">Enviando a cabina…</p>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 relative flex flex-col items-center justify-center gap-5 text-center overflow-hidden py-4"
          >
            <AirBurstParticles color={accent} />

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.08 }}
              className="relative"
            >
              <div className="saludos-success-ring">
                <SaludoMotivoIcon id={motivo} />
              </div>
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{ scale: [1, 1.45], opacity: [0.35, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ border: `2px solid ${accent}` }}
                aria-hidden
              />
            </motion.div>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, ease: EASE_OUT }}
                className="font-display text-3xl text-white leading-none tracking-wide"
              >
                ¡Al aire!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: EASE_OUT }}
                className="text-white/50 text-sm mt-2 leading-relaxed max-w-[16rem] mx-auto"
              >
                Tu saludo para <span className="text-white font-semibold">{para}</span>
                {' '}de parte de <span className="text-white font-semibold">{de}</span>
                {' '}ya está en la cola del locutor.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `${accent}14`, border: `1px solid ${accent}33` }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} aria-hidden />
              <span className="text-xs font-semibold" style={{ color: accent }}>
                Radio Bienvenida 93.3 FM
              </span>
            </motion.div>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, ease: EASE_OUT }}
              onClick={reset}
              className="saludos-btn saludos-btn--outline"
              style={{ '--saludo-accent': accent } as CSSProperties}
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden strokeWidth={2.5} />
              Enviar otro saludo
            </motion.button>
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-white/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
                <path d="M4 8h16v12H4z" strokeLinejoin="round" />
                <path d="M4 8l8 6 8-6" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-red-400/90 text-sm max-w-[14rem]">{errMsg}</p>
            <button
              type="button"
              onClick={() => setStep('de')}
              className="saludos-btn saludos-btn--outline max-w-[14rem]"
              style={{ '--saludo-accent': accent } as CSSProperties}
            >
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden strokeWidth={2.25} />
              Intentar de nuevo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
