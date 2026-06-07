'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOTIVOS, type MotivoId } from '@/lib/saludoTypes'
import { SaludosStepRail } from '@/components/engagement/SaludosStepRail'
import { EASE_OUT, springSnappy, staggerContainer, staggerItem } from '@/lib/motion/framer'
import { RADIO } from '@/lib/radioConfig'
import { animateStagger } from '@/lib/motion/anime'
import { Plus, RotateCcw } from 'lucide-react'

type Step = 'motivo' | 'escribe' | 'sending' | 'done' | 'error'

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
    const glyphs = ['🎉', '❤️', '✨', '📻', '🎂', '👋']
    const particles = Array.from({ length: 22 }, (_, i) => {
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.5
      const speed = 2 + Math.random() * 5
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        glyph: glyphs[i % glyphs.length]!,
        size: 14 + Math.random() * 10,
        alpha: 1,
        life: 0.6 + Math.random() * 0.4,
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
        p.vy += 0.05
        p.alpha = 1 - t / p.life
        if (p.alpha <= 0) return
        alive++
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.font = `${p.size}px Montserrat, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.glyph, p.x, p.y)
        ctx.restore()
      })
      if (alive > 0) frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [color])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden />
}

function RadioWaves({ color = '#db8918' }: { color?: string }) {
  return (
    <div className="flex items-end justify-center gap-1.5 h-10" aria-hidden>
      {[0.35, 0.75, 1, 0.6, 0.45, 0.85].map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full origin-bottom"
          style={{ background: color, height: 32 }}
          animate={{ scaleY: [h, 1.15, h * 0.35, 1, h] }}
          transition={{ duration: 0.95, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

const slideVariants = {
  enter: { opacity: 0, y: 16, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
}

export function SaludoForm({
  compact,
  onMotivoChange,
}: {
  compact?: boolean
  onMotivoChange?: (id: MotivoId) => void
} = {}) {
  const [step, setStep] = useState<Step>('motivo')
  const [motivo, setMotivo] = useState<MotivoId>('cumpleanos')
  const [para, setPara] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [de, setDe] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)

  const selected = MOTIVOS.find(m => m.id === motivo)!
  const accent = selected.color
  const railStep = step === 'motivo' ? 'motivo' : step === 'escribe' ? 'escribe' : 'escribe'

  function pickMotivo(id: MotivoId) {
    setMotivo(id)
    onMotivoChange?.(id)
    if (navigator.vibrate) navigator.vibrate(12)
    const card = gridRef.current?.querySelector(`[data-motivo="${id}"]`) as HTMLElement | null
    if (card) {
      void import('animejs').then(({ animate }) => {
        animate(card, {
          scale: [1, 1.08, 1],
          rotate: [0, -2, 2, 0],
          duration: 480,
          ease: 'spring(1, 90, 14, 0)',
        })
      })
    }
    setTimeout(() => setStep('escribe'), 380)
  }

  useEffect(() => {
    if (step !== 'motivo' || !gridRef.current) return
    const el = gridRef.current
    const t = requestAnimationFrame(() => {
      void animateStagger(el, '[data-motivo]', {
        translateY: [24, 0],
        opacity: [0, 1],
        scale: [0.88, 1],
        rotate: [-4, 0],
        duration: 520,
        staggerMs: 55,
        ease: 'out(3)',
      })
    })
    return () => cancelAnimationFrame(t)
  }, [step])

  async function send() {
    if (!para.trim() || !de.trim()) return
    setStep('sending')
    try {
      const res = await fetch('/api/saludos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ para, de, motivo, mensaje: mensaje || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error ?? 'No se pudo mandar — intenta de nuevo')
        setStep('error')
        return
      }
      playOnAirSound()
      if (navigator.vibrate) navigator.vibrate([25, 60, 30, 60, 50])
      setStep('done')
    } catch {
      setErrMsg('Sin conexión — revisa tu internet')
      setStep('error')
    }
  }

  function reset() {
    setPara('')
    setMensaje('')
    setDe('')
    setMotivo('cumpleanos')
    onMotivoChange?.('cumpleanos')
    setStep('motivo')
  }

  const canSend = para.trim() && de.trim()

  return (
    <div
      className={`saludos-form ${compact ? 'saludos-form--compact' : ''}`}
      style={{ '--input-accent': accent, '--saludos-accent': accent } as CSSProperties}
    >
      {!['sending', 'done', 'error'].includes(step) && (
        <SaludosStepRail active={railStep} accent={accent} />
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
              className="flex flex-col flex-1 min-h-0 min-w-0 gap-2.5 w-full"
            >
              <h2 className="saludos-step-heading">¿Qué le mandamos al aire?</h2>

              <div ref={gridRef} className="saludos-motivo-grid">
                {MOTIVOS.map(m => (
                  <motion.button
                    key={m.id}
                    type="button"
                    data-motivo={m.id}
                    whileTap={{ scale: 0.94, rotate: -1 }}
                    onClick={() => pickMotivo(m.id)}
                    className="saludos-motivo-card"
                    style={{
                      '--motivo-color': m.color,
                      '--motivo-glow': m.glow,
                    } as CSSProperties}
                  >
                    <span className="saludos-motivo-card__emoji" aria-hidden>
                      {m.emoji}
                    </span>
                    <span className="saludos-motivo-card__label">{m.label}</span>
                    <span className="saludos-motivo-card__tag">{m.tagline}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'escribe' && (
            <motion.div
              key="escribe"
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
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="saludos-motivo-chip" style={{ background: `${accent}18`, borderColor: `${accent}44`, color: accent }}>
                    <span className="text-lg leading-none">{selected.emoji}</span>
                    {selected.label}
                  </span>
                </div>
              </div>

              <motion.div
                variants={{ initial: {}, animate: staggerContainer.animate }}
                initial="initial"
                animate="animate"
                className="flex flex-col gap-3 flex-1 min-w-0 w-full"
              >
                <motion.label variants={staggerItem} className="flex flex-col gap-1 min-w-0 w-full">
                  <span className="saludos-label">¿Para quién va?</span>
                  <input
                    value={para}
                    onChange={e => setPara(e.target.value)}
                    placeholder={
                      motivo === 'cumpleanos' ? 'Ej: mi mamá Rosa' :
                      motivo === 'aniversario' ? 'Ej: mi polola Ana' :
                      motivo === 'apoyo' ? 'Ej: mi compadre Pedro' : 'Ej: mi abuela Luisa'
                    }
                    maxLength={80}
                    autoFocus
                    className="saludos-input saludos-input--line text-lg"
                  />
                </motion.label>

                <motion.label variants={staggerItem} className="flex flex-col gap-1 min-w-0 w-full">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="saludos-label">Tu mensaje</span>
                    <span className="text-[10px] text-white/30 tabular-nums">{mensaje.length}/120</span>
                  </div>
                  <textarea
                    value={mensaje}
                    onChange={e => setMensaje(e.target.value.slice(0, 120))}
                    placeholder="Lo que quieras que diga el locutor…"
                    rows={3}
                    className="saludos-input saludos-textarea text-sm"
                  />
                </motion.label>

                <motion.label variants={staggerItem} className="flex flex-col gap-1 min-w-0 w-full">
                  <span className="saludos-label">¿De parte de quién?</span>
                  <input
                    value={de}
                    onChange={e => setDe(e.target.value)}
                    placeholder="Tu nombre, la familia, los compadres…"
                    maxLength={60}
                    className="saludos-input saludos-input--line text-lg"
                  />
                </motion.label>

                <AnimatePresence>
                  {canSend && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="saludos-cabina-card"
                      style={{ '--cabina-accent': accent } as CSSProperties}
                    >
                      <div className="saludos-cabina-card__header">
                        <span className="saludos-cabina-card__live">
                          <span className="saludos-cabina-card__dot" />
                          Así lo ve cabina
                        </span>
                        <span className="saludos-cabina-card__fm">{RADIO.frequency}</span>
                      </div>
                      <p className="saludos-cabina-card__body">
                        <span className="saludos-cabina-card__para">Para {para}</span>
                        {mensaje && <span className="saludos-cabina-card__msg">&ldquo;{mensaje}&rdquo;</span>}
                        <span className="saludos-cabina-card__de">— de {de}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  variants={staggerItem}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={send}
                  disabled={!canSend}
                  className={`saludos-btn saludos-btn--air mt-auto ${canSend ? 'is-ready' : 'is-disabled'}`}
                >
                  {canSend && (
                    <motion.span
                      className="saludos-btn__shine absolute inset-0 pointer-events-none"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                      aria-hidden
                    />
                  )}
                  <span className="relative z-[1] flex items-center justify-center gap-2">
                    <span className="text-lg" aria-hidden>🎙️</span>
                    ¡Dale, al aire!
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 'sending' && (
            <motion.div
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 py-6"
            >
              <RadioWaves color={accent} />
              <p className="font-display text-xl text-white tracking-wide">Subiendo a cabina…</p>
              <p className="text-white/40 text-sm">El locutor lo recibe al tiro</p>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 relative flex flex-col items-center justify-center gap-4 text-center overflow-hidden py-5"
            >
              <AirBurstParticles color={accent} />

              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="saludos-air-burst font-display"
                style={{ color: accent }}
              >
                ¡VA AL AIRE!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: EASE_OUT }}
                className="saludos-success-ring text-3xl"
                style={{ borderColor: `${accent}55`, background: `${accent}15`, color: accent }}
              >
                {selected.emoji}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ease: EASE_OUT }}
                className="text-white/55 text-sm leading-relaxed max-w-[17rem] mx-auto"
              >
                Tu saludo para <span className="text-white font-bold">{para}</span>
                {' '}de parte de <span className="text-white font-bold">{de}</span>
                {' '}ya está en la cola — quédate sintonizado.
              </motion.p>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, ease: EASE_OUT }}
                onClick={reset}
                className="saludos-btn saludos-btn--outline"
                style={{ '--saludo-accent': accent } as CSSProperties}
              >
                <Plus className="w-4 h-4 shrink-0" aria-hidden strokeWidth={2.5} />
                Otro saludo
              </motion.button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-6"
            >
              <span className="text-4xl" aria-hidden>📡</span>
              <p className="text-red-400/90 text-sm max-w-[15rem]">{errMsg}</p>
              <button
                type="button"
                onClick={() => setStep('escribe')}
                className="saludos-btn saludos-btn--outline max-w-[14rem]"
                style={{ '--saludo-accent': accent } as CSSProperties}
              >
                <RotateCcw className="w-4 h-4 shrink-0" aria-hidden strokeWidth={2.25} />
                Reintentar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
