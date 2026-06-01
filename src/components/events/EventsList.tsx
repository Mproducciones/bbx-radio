'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Event {
  _id: string
  title: string
  date?: string
  description?: string
}

const DEMO_EVENTS: Event[] = [
  { _id: 'e1', title: 'Festival de Verano 2025',           date: '2026-06-15T20:00:00', description: 'La gran fiesta de verano con los mejores artistas de la región. Parque Municipal · Entrada liberada.' },
  { _id: 'e2', title: 'Noche de Cumbia en Vivo',           date: '2026-06-22T21:30:00', description: 'Una noche imperdible con las orquestas más reconocidas del género. Teatro Municipal · Venta de entradas en boletería.' },
  { _id: 'e3', title: 'Feria de Emprendedores Locales',    date: '2026-06-28T10:00:00', description: 'Apoya a los emprendedores de nuestra ciudad. Gastronomía, artesanía y música en vivo. Plaza de Armas.' },
  { _id: 'e4', title: 'Concierto Sinfónico al Aire Libre', date: '2026-07-05T19:00:00', description: 'La orquesta sinfónica regional trae un programa especial. Anfiteatro Regional · Entrada gratuita.' },
]

function parseDate(d?: string) {
  if (!d) return null
  try { return new Date(d) } catch { return null }
}

function formatDay(d: Date) {
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }).toUpperCase()
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function Countdown({ target }: { target: Date }) {
  const [diff, setDiff] = useState(target.getTime() - Date.now())

  useEffect(() => {
    const t = setInterval(() => setDiff(target.getTime() - Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])

  if (diff <= 0) return <span className="text-[#00D9A0] text-[10px] font-bold">HOY</span>

  const days    = Math.floor(diff / 86_400_000)
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)

  if (days > 30) return null

  return (
    <div className="flex items-center gap-1 mt-2">
      {days > 0 && <Digit v={days} label="d" />}
      <Digit v={hours} label="h" />
      <Digit v={minutes} label="m" />
      {days === 0 && <Digit v={seconds} label="s" />}
    </div>
  )
}

function Digit({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="font-display text-lg text-white leading-none tabular-nums">{String(v).padStart(2, '0')}</span>
      <span className="text-white/30 text-[9px]">{label}</span>
    </div>
  )
}

const ACCENTS = ['#db8918', '#40B9BF', '#7D59B5', '#FF8C42']

export function EventsList({ events }: { events: Event[] }) {
  const display = events?.length > 0 ? events : DEMO_EVENTS
  const now = new Date()

  const upcoming = display
    .map(e => ({ ...e, parsedDate: parseDate(e.date) }))
    .sort((a, b) => (a.parsedDate?.getTime() ?? 0) - (b.parsedDate?.getTime() ?? 0))

  const next = upcoming.find(e => e.parsedDate && e.parsedDate > now)

  return (
    <div className="flex flex-col gap-3">
      {/* Próximo evento destacado */}
      {next && next.parsedDate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: 'rgba(219,137,24,0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(219,137,24,0.25)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #db8918, transparent)' }} />
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-center min-w-[48px]">
              <p className="font-display text-3xl text-white leading-none">{next.parsedDate.getDate()}</p>
              <p className="text-[#db8918] text-[9px] font-bold uppercase tracking-wider">
                {next.parsedDate.toLocaleDateString('es-CL', { month: 'short' })}
              </p>
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#db8918]">Próximo evento</span>
              <h2 className="text-white font-bold text-base leading-tight mt-0.5">{next.title}</h2>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{next.description}</p>
              <Countdown target={next.parsedDate} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-[23px] top-4 bottom-4 w-px" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)' }} />

        <div className="flex flex-col gap-3">
          {upcoming.map((event, i) => {
            const accent = ACCENTS[i % ACCENTS.length]
            const isPast = event.parsedDate ? event.parsedDate < now : false
            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: isPast ? 0.4 : 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4 items-start"
              >
                {/* Dot en la línea */}
                <div className="flex-shrink-0 w-12 flex flex-col items-center gap-0.5 pt-1">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: accent, background: isPast ? 'transparent' : `${accent}25` }}>
                    {!isPast && <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />}
                  </div>
                  {event.parsedDate && (
                    <span className="text-[8px] font-bold text-center leading-none" style={{ color: accent }}>
                      {formatDay(event.parsedDate).split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-xl p-4 mb-1"
                  style={{
                    background: 'rgba(15,15,26,0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${accent}20`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white font-semibold text-sm leading-snug">{event.title}</h3>
                    {event.parsedDate && (
                      <span className="text-[10px] text-white/40 flex-shrink-0">{formatTime(event.parsedDate)}</span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-white/40 text-xs mt-1.5 leading-relaxed">{event.description}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
