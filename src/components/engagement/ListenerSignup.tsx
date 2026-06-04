'use client'

import { useState, useEffect, useRef, type CSSProperties, type FormEvent } from 'react'
import { motion, AnimatePresence, animate as fmAnimate } from 'framer-motion'
import { EASE_OUT, springSnappy, staggerItem } from '@/lib/motion/framer'
import { animateStagger } from '@/lib/motion/anime'

const ACCENT = '#7D59B5'
const ACCENT_HOT = '#FF006E'
const SUCCESS = '#00D9A0'

type Phase = 'nombre' | 'contacto' | 'sending' | 'done' | 'error'
type ActiveContest = {
  id: string
  title: string
  prize: string
  description: string | null
  sponsorName: string | null
  deadline: string | null
}

const STEPS: Phase[] = ['nombre', 'contacto']

async function playEntrySound() {
  try {
    const Ctx = window.AudioContext
      || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    if (ctx.state === 'suspended') await ctx.resume()
    const notes: [number, number][] = [[392, 0], [494, 0.08], [587, 0.16], [784, 0.28]]
    notes.forEach(([freq, delay]) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'triangle'
      const t = ctx.currentTime + delay
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.14, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42)
      osc.start(t)
      osc.stop(t + 0.42)
    })
  } catch { /* opcional */ }
}

function BurstParticles({ colors }: { colors: string[] }) {
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
    const particles = Array.from({ length: 42 }, (_, i) => {
      const angle = (i / 42) * Math.PI * 2 + Math.random() * 0.5
      const speed = 2.2 + Math.random() * 5
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.2 + Math.random() * 3,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0.5 + Math.random() * 0.4,
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
        p.vy += 0.035
        p.alpha = 1 - t / p.life
        if (p.alpha <= 0) return
        alive++
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      ctx.globalAlpha = 1
      if (alive > 0) frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [colors])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
}

function SorteoWaves() {
  return (
    <div className="flex items-end justify-center gap-1 h-8" aria-hidden>
      {[0.3, 0.65, 1, 0.55, 0.8, 0.4].map((h, i) => (
        <motion.div
          key={i}
          className="sorteo-waves__bar origin-bottom"
          animate={{ scaleY: [h, 1.15, h * 0.35, 1, h] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function SorteoTicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 6v12" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
    </svg>
  )
}

const slideVariants = {
  enter: { x: '14%', opacity: 0, filter: 'blur(4px)' },
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: { x: '-10%', opacity: 0, filter: 'blur(3px)' },
}

function SorteoEmpty() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const t = requestAnimationFrame(() => {
      void animateStagger(el, '[data-sorteo-empty]', {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 520,
        staggerMs: 90,
        ease: 'out(3)',
      })
    })
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div ref={ref} className="sorteo-empty">
      <div className="sorteo-panel__mesh" aria-hidden />
      <div className="sorteo-panel__scan" aria-hidden />
      <div data-sorteo-empty className="sorteo-empty__ring">
        <SorteoTicketIcon className="sorteo-ticket-icon" />
      </div>
      <p data-sorteo-empty className="font-display text-lg text-white">
        Próximo sorteo en camino
      </p>
      <p data-sorteo-empty className="text-white/40 text-xs max-w-[220px] mt-2 leading-relaxed">
        Quédate en la radio: el locutor anuncia los concursos al aire.
      </p>
    </div>
  )
}

function SorteoPrizeHeader({ contest }: { contest: ActiveContest }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    void import('animejs').then(({ animate }) => {
      animate(el, {
        translateY: [12, 0],
        opacity: [0, 1],
        duration: 560,
        ease: 'out(3)',
      })
    })
  }, [contest.id])

  return (
    <header ref={ref} className="sorteo-prize relative z-[1] min-w-0">
      <div className="sorteo-prize__shimmer" aria-hidden />
      <span className="sorteo-prize__badge">
        <span className="sorteo-prize__badge-dot" aria-hidden />
        Sorteo en vivo
      </span>
      <h3 className="sorteo-prize__title break-words">{contest.title}</h3>
      <p className="sorteo-prize__reward break-words">{contest.prize}</p>
      {contest.sponsorName && (
        <p className="sorteo-prize__sponsor truncate">Auspicia · {contest.sponsorName}</p>
      )}
    </header>
  )
}

function PositionCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    setDisplay(0)
    const ctrl = fmAnimate(0, value, {
      duration: 0.95,
      ease: EASE_OUT,
      onUpdate: latest => setDisplay(Math.round(latest)),
    })
    return () => ctrl.stop()
  }, [value])

  return (
    <motion.p
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className="sorteo-success-num mt-2"
    >
      #{display}
    </motion.p>
  )
}

/** Panel Sorteo — experiencia inmersiva (Participa). */
export function ListenerSignup({
  playful: _playful,
  className,
}: {
  playful?: boolean
  className?: string
} = {}) {
  const [contest, setContest] = useState<ActiveContest | null>(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<Phase>('nombre')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState(0)
  const [errMsg, setErrMsg] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  const stepIndex = STEPS.indexOf(phase as (typeof STEPS)[number])

  useEffect(() => {
    fetch('/api/contests/active')
      .then(r => r.json())
      .then(data => { if (data?.id) setContest(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!['nombre', 'contacto'].includes(phase) || !bodyRef.current) return
    const el = bodyRef.current
    const t = requestAnimationFrame(() => {
      void animateStagger(el, '[data-sorteo-field]', {
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 500,
        staggerMs: 75,
        ease: 'out(3)',
      })
    })
    return () => cancelAnimationFrame(t)
  }, [phase, contest?.id])

  async function submit(e: FormEvent) {
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

      if (!res.ok) {
        setErrMsg(data.error ?? 'Error al registrarse')
        setPhase('error')
        return
      }

      setPosition(data.position)
      playEntrySound()
      if (navigator.vibrate) navigator.vibrate([15, 70, 25, 70, 40])
      setPhase('done')
    } catch {
      setErrMsg('Error de conexión')
      setPhase('error')
    }
  }

  if (loading) {
    return (
      <div className="sorteo-panel flex items-center justify-center min-h-[12rem]">
        <div className="w-9 h-9 border-2 border-[#7D59B5] border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
      </div>
    )
  }

  if (!contest) return <SorteoEmpty />

  return (
    <div
      className={`sorteo-panel participa-panel participa-sorteo-panel relative flex flex-col flex-1 min-h-0 min-w-0 max-w-full w-full ${className ?? ''}`}
    >
      <div className="sorteo-panel__mesh" aria-hidden />
      <motion.div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none blur-3xl"
        style={{ background: ACCENT }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.32, 0.15] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      <SorteoPrizeHeader contest={contest} />

      <div ref={bodyRef} className="sorteo-body relative z-[1] w-full min-w-0">
        {!['sending', 'done', 'error'].includes(phase) && (
          <div className="sorteo-progress" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={2}>
            {STEPS.map((s, i) => (
              <div key={s} className="sorteo-progress__seg">
                <motion.div
                  className="sorteo-progress__fill"
                  initial={false}
                  animate={{ scaleX: stepIndex >= i ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'nombre' && (
            <motion.div
              key="nombre"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springSnappy}
              className="flex flex-col flex-1 min-h-0 min-w-0 gap-3 w-full"
            >
              <div className="min-w-0">
                <p className="sorteo-step-title">Paso 1 de 2</p>
                <h4 className="sorteo-step-heading">¿Cómo te llamas?</h4>
              </div>

              {contest.description && (
                <p data-sorteo-field className="sorteo-desc">{contest.description}</p>
              )}
              {contest.deadline && (
                <p data-sorteo-field className="sorteo-deadline">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                  Cierra · {contest.deadline}
                </p>
              )}

              <label data-sorteo-field className="flex flex-col min-w-0 w-full">
                <span className="sorteo-label">Tu nombre</span>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: María González"
                  maxLength={60}
                  autoFocus
                  className="sorteo-input"
                />
              </label>

              <motion.button
                type="button"
                data-sorteo-field
                whileTap={{ scale: 0.98 }}
                onClick={() => { if (name.trim()) setPhase('contacto') }}
                disabled={!name.trim()}
                className={`sorteo-btn ${name.trim() ? 'is-ready' : 'is-disabled'}`}
              >
                Continuar
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                </svg>
              </motion.button>
              <p data-sorteo-field className="sorteo-legal">
                Tus datos se usan solo para este concurso.
              </p>
            </motion.div>
          )}

          {phase === 'contacto' && (
            <motion.form
              key="contacto"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springSnappy}
              onSubmit={submit}
              className="flex flex-col flex-1 min-h-0 min-w-0 gap-3 w-full"
              style={{ '--input-accent': ACCENT } as CSSProperties}
            >
              <div className="flex items-start gap-2 min-w-0 w-full">
                <button
                  type="button"
                  onClick={() => setPhase('nombre')}
                  className="sorteo-back"
                  aria-label="Volver"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="sorteo-step-title">Paso 2 de 2</p>
                  <h4 className="sorteo-step-heading min-w-0">
                    Hola,{' '}
                    <span className="inline-block max-w-full truncate align-bottom" style={{ color: ACCENT }}>
                      {name.trim()}
                    </span>
                  </h4>
                </div>
              </div>

              <motion.label variants={staggerItem} data-sorteo-field className="flex flex-col min-w-0 w-full">
                <span className="sorteo-label">WhatsApp o teléfono</span>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+56 9 …"
                  inputMode="tel"
                  autoFocus
                  className="sorteo-input"
                />
              </motion.label>

              <motion.div
                data-sorteo-field
                className="rounded-xl px-3 py-2.5 text-[11px] leading-relaxed min-w-0 w-full box-border"
                style={{
                  background: 'rgba(125,89,181,0.08)',
                  border: '1px solid rgba(125,89,181,0.22)',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Al enviar quedas inscrito en la cola del sorteo. El locutor anuncia al ganador en vivo.
              </motion.div>

              <motion.button
                type="submit"
                data-sorteo-field
                whileTap={{ scale: 0.98 }}
                disabled={!phone.trim()}
                className={`sorteo-btn ${phone.trim() ? 'is-ready' : 'is-disabled'}`}
              >
                <SorteoTicketIcon className="w-5 h-5" />
                Quiero participar
              </motion.button>
              <p data-sorteo-field className="sorteo-legal">
                Sin spam · solo para este sorteo.
              </p>
            </motion.form>
          )}

          {phase === 'sending' && (
            <motion.div
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 py-8"
            >
              <SorteoWaves />
              <div
                className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${ACCENT}55`, borderTopColor: 'transparent' }}
                aria-hidden
              />
              <p className="text-white/40 text-sm">Inscribiendo tu cupo…</p>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 relative flex flex-col items-center justify-center text-center py-6 overflow-hidden"
            >
              <BurstParticles colors={[ACCENT, ACCENT_HOT, SUCCESS, '#db8918']} />

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <div className="sorteo-success-ring mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>

              <p className="text-[#00D9A0] text-[10px] font-black uppercase tracking-[0.14em] mt-5">
                Inscrito
              </p>
              <p className="text-white/45 text-xs mt-1">Tu número en la cola</p>
              <PositionCounter value={position} />

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ease: EASE_OUT }}
                className="text-white/50 text-xs mt-3 max-w-[15rem] leading-relaxed"
              >
                El locutor anuncia al ganador en vivo. ¡Mucha suerte, {name.trim()}!
              </motion.p>

              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                onClick={() => {
                  setName('')
                  setPhone('')
                  setPhase('nombre')
                }}
                className="sorteo-btn sorteo-btn--ghost max-w-[11rem] mt-5"
              >
                Otro registro
              </motion.button>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.25)', color: ACCENT_HOT }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <p className="text-red-400/90 text-sm max-w-[14rem]">{errMsg}</p>
              <button
                type="button"
                onClick={() => setPhase('contacto')}
                className="sorteo-btn sorteo-btn--ghost max-w-[10rem]"
              >
                Intentar de nuevo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
