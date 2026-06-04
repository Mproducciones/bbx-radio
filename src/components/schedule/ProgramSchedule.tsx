'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic2, Radio, CalendarOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE_OUT, staggerDelay } from '@/lib/motion/framer'
import type { Program } from '@/types/radio'
import { getLiveProgram, getToday, programsForDay, type DayKey } from '@/lib/programSchedule'

const DAYS: { key: DayKey; label: string; full: string }[] = [
  { key: 'mon', label: 'Lun', full: 'Lunes' },
  { key: 'tue', label: 'Mar', full: 'Martes' },
  { key: 'wed', label: 'Mié', full: 'Miércoles' },
  { key: 'thu', label: 'Jue', full: 'Jueves' },
  { key: 'fri', label: 'Vie', full: 'Viernes' },
  { key: 'sat', label: 'Sáb', full: 'Sábado' },
  { key: 'sun', label: 'Dom', full: 'Domingo' },
]

const LIVE_BG = 'rgba(219,137,24,0.08)'
const LIVE_BORDER = 'rgba(219,137,24,0.28)'
const LIVE_ACCENT = 'var(--color-mag-400)'

export function ProgramSchedule({
  programs,
  className,
  initialDay,
  fill,
}: {
  programs: Program[]
  className?: string
  initialDay?: DayKey
  /** Ocupa el alto disponible; la lista hace scroll interno si hace falta */
  fill?: boolean
}) {
  const [today, setToday] = useState<DayKey>(initialDay ?? 'mon')
  const [selectedDay, setSelectedDay] = useState<DayKey>(initialDay ?? 'mon')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    const d = getToday()
    setToday(d)
    if (!initialDay) setSelectedDay(d)
  }, [initialDay])

  const filtered = programsForDay(programs, selectedDay)
  const liveProgram = selectedDay === today ? getLiveProgram(filtered) : undefined
  const selectedFull = DAYS.find(d => d.key === selectedDay)?.full ?? ''

  return (
    <section
      aria-labelledby="programacion-heading"
      className={cn(
        'relative flex flex-col gap-3 max-md:gap-2 rounded-3xl p-3 max-md:p-3 md:p-4',
        fill && 'flex-1 min-h-0',
        className,
      )}
      style={{
        background: 'rgba(7,7,14,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(219,137,24,0.12)' }}
          >
            <Radio className="w-4 h-4" style={{ color: LIVE_ACCENT }} aria-hidden />
          </div>
          <h2 id="programacion-heading" className="font-display text-xl max-md:text-lg md:text-2xl text-white leading-none">
            Programación
          </h2>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={selectedDay}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="text-sm font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
          >
            {selectedFull}
          </motion.span>
        </AnimatePresence>
      </div>

      <div
        role="tablist"
        aria-label="Día de la semana"
        className="flex items-center p-1 rounded-2xl gap-0.5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        suppressHydrationWarning
      >
        {hydrated && DAYS.map(d => {
          const isActive = d.key === selectedDay
          const isToday = d.key === today
          return (
            <motion.button
              key={d.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${d.full}${isToday ? ', hoy' : ''}`}
              onClick={() => setSelectedDay(d.key)}
              whileTap={{ scale: 0.92 }}
              className="relative flex-1 flex flex-col items-center justify-center min-w-0 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold tracking-wide transition-colors"
              style={
                isActive
                  ? { background: LIVE_ACCENT, color: '#fff', boxShadow: '0 2px 12px rgba(219,137,24,0.35)' }
                  : { color: 'rgba(255,255,255,0.88)', background: 'rgba(255,255,255,0.04)' }
              }
            >
              {isToday && !isActive && (
                <span
                  className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: LIVE_ACCENT }}
                  aria-hidden
                />
              )}
              {d.label}
            </motion.button>
          )
        })}
        {!hydrated && (
          <div className="flex-1 py-2 text-center text-[10px] text-white/20">Cargando…</div>
        )}
      </div>

      {!hydrated ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedDay}
          role="tabpanel"
          aria-label={`Programas del ${selectedFull.toLowerCase()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className={cn(
            'flex flex-col gap-1.5 max-md:gap-1',
            fill && 'flex-1 min-h-0 overflow-y-auto overscroll-contain max-md:pb-[calc(var(--app-mini-player-total)+0.25rem)]',
          )}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <CalendarOff className="w-6 h-6 text-white/20" aria-hidden />
              </div>
              <p className="text-white/30 text-sm">Sin programas para {selectedFull.toLowerCase()}</p>
            </div>
          ) : (
            filtered.map((program, i) => (
              <ProgramRow
                key={program.id}
                program={program}
                isLive={program.id === liveProgram?.id}
                index={i}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
      )}
    </section>
  )
}

function ProgramRow({ program, isLive, index }: { program: Program; isLive: boolean; index: number }) {
  const hostLabel =
    program.host && program.host !== 'Por confirmar'
      ? program.host
      : 'Conductor por confirmar'

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={staggerDelay(index, 0.04, 0.05)}
      className="relative flex items-center gap-2.5 max-md:gap-2 p-3 max-md:p-2.5 rounded-2xl overflow-hidden"
      style={
        isLive
          ? { background: LIVE_BG, border: `1px solid ${LIVE_BORDER}` }
          : { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }
      }
      aria-current={isLive ? 'true' : undefined}
    >
      {isLive && (
        <div
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
          style={{ background: LIVE_ACCENT }}
          aria-hidden
        />
      )}

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={
          isLive
            ? { background: 'rgba(219,137,24,0.15)' }
            : { background: 'rgba(255,255,255,0.05)' }
        }
      >
        {program.imageUrl ? (
          <Image
            src={program.imageUrl}
            alt=""
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        ) : (
          <Mic2
            className="w-4 h-4"
            style={{ color: isLive ? LIVE_ACCENT : 'rgba(255,255,255,0.3)' }}
            aria-hidden
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="font-bold text-sm truncate"
            style={{ color: isLive ? '#fff' : 'rgba(255,255,255,0.8)' }}
          >
            {program.name}
          </p>
          {isLive && (
            <span
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest flex-shrink-0 px-1.5 py-0.5 rounded-full"
              style={{ background: LIVE_ACCENT, color: '#fff' }}
            >
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" aria-hidden />
              EN VIVO
            </span>
          )}
        </div>
        {program.sponsor && (
          <p
            className="text-[9px] font-bold uppercase tracking-wide mt-0.5 truncate"
            style={{ color: program.sponsor.colorAccent ?? '#7D59B5' }}
          >
            Presenta: {program.sponsor.cliente}
          </p>
        )}
        {program.host && program.host !== 'Por confirmar' && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {hostLabel}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end flex-shrink-0 text-right">
        <span
          className="text-xs font-semibold tabular-nums"
          style={{ color: isLive ? LIVE_ACCENT : 'rgba(255,255,255,0.4)' }}
        >
          {program.startTime}
        </span>
        <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {program.endTime}
        </span>
      </div>
    </motion.article>
  )
}
