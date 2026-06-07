'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, CalendarOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE_OUT, staggerDelay } from '@/lib/motion/framer'
import type { Program } from '@/types/radio'
import { getLiveProgram, getToday, programsForDay, type DayKey } from '@/lib/programSchedule'
import { getProgramArt, resolveProgramCover } from '@/lib/programArt'

const DAYS: { key: DayKey; label: string; full: string }[] = [
  { key: 'mon', label: 'Lun', full: 'Lunes' },
  { key: 'tue', label: 'Mar', full: 'Martes' },
  { key: 'wed', label: 'Mié', full: 'Miércoles' },
  { key: 'thu', label: 'Jue', full: 'Jueves' },
  { key: 'fri', label: 'Vie', full: 'Viernes' },
  { key: 'sat', label: 'Sáb', full: 'Sábado' },
  { key: 'sun', label: 'Dom', full: 'Domingo' },
]

const LIVE_ACCENT = 'var(--color-mag-400)'

export function ProgramSchedule({
  programs,
  className,
  initialDay,
  fill,
  hideHeader,
}: {
  programs: Program[]
  className?: string
  initialDay?: DayKey
  /** Ocupa el alto disponible; la lista hace scroll interno si hace falta */
  fill?: boolean
  /** Oculta título interno cuando la página ya tiene SectionHeader */
  hideHeader?: boolean
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
      aria-label="Programación semanal"
      aria-labelledby={hideHeader ? undefined : 'programacion-heading'}
      className={cn(
        'prog-schedule',
        hideHeader && 'prog-schedule--embedded',
        fill && 'md:flex-1 md:min-h-0',
        className,
      )}
    >
      {!hideHeader ? (
        <div className="prog-schedule__header">
          <div className="prog-schedule__title-row">
            <div className="prog-schedule__icon" aria-hidden>
              <Radio className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: LIVE_ACCENT }} />
            </div>
            <h2 id="programacion-heading" className="prog-schedule__title">
              Programación
            </h2>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={selectedDay}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="prog-schedule__day-pill"
            >
              {selectedFull}
            </motion.span>
          </AnimatePresence>
        </div>
      ) : null}

      <div
        role="tablist"
        aria-label="Día de la semana"
        className="prog-schedule__days"
        suppressHydrationWarning
      >
        {hydrated && DAYS.map((d, dayIndex) => {
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={staggerDelay(dayIndex, 0.04, 0.15)}
              className={cn('prog-schedule__day', isActive && 'is-active')}
            >
              {isToday && !isActive && (
                <span className="prog-schedule__today-dot" aria-hidden />
              )}
              {d.label}
            </motion.button>
          )
        })}
        {!hydrated && (
          <div className="flex-1 py-1.5 text-center text-[10px] text-white/20">Cargando…</div>
        )}
      </div>

      {!hydrated ? (
        <div className="prog-schedule__list">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="prog-schedule__skeleton" />
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
              'prog-schedule__list',
              fill && 'md:flex-1 md:min-h-0 md:overflow-y-auto md:overscroll-contain',
            )}
          >
            {filtered.length === 0 ? (
              <div className="prog-schedule__empty">
                <div className="prog-schedule__empty-icon">
                  <CalendarOff className="w-5 h-5 text-white/20" aria-hidden />
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
      : 'Equipo Bienvenida'
  const art = getProgramArt(program.name)
  const cover = resolveProgramCover(program.name, program.imageUrl)

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={staggerDelay(index, 0.03, 0.04)}
      className={cn('prog-schedule__row', isLive && 'is-live')}
      style={{ '--prog-accent': art.color } as React.CSSProperties}
      aria-current={isLive ? 'true' : undefined}
    >
      {isLive && <div className="prog-schedule__live-bar" aria-hidden />}

      <div className="prog-schedule__thumb">
        <Image
          src={cover}
          alt=""
          width={48}
          height={48}
          className="prog-schedule__thumb-img"
          unoptimized
        />
        <div className="prog-schedule__thumb-shade" aria-hidden />
      </div>

      <div className="prog-schedule__info min-w-0 flex-1">
        <div className="prog-schedule__name-row">
          <p className="prog-schedule__name">{program.name}</p>
          {isLive && (
            <span className="prog-schedule__live-badge">
              <span className="prog-schedule__live-dot" aria-hidden />
              EN VIVO
            </span>
          )}
        </div>
        {program.sponsor && (
          <p
            className="prog-schedule__sponsor"
            style={{ color: program.sponsor.colorAccent ?? '#7D59B5' }}
          >
            Presenta: {program.sponsor.cliente}
          </p>
        )}
        <p className="prog-schedule__host">{hostLabel}</p>
      </div>

      <div className="prog-schedule__time">
        <span className="prog-schedule__time-range">
          {program.startTime} – {program.endTime}
        </span>
      </div>
    </motion.article>
  )
}
