'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Program } from '@/types/radio'

interface ProgramScheduleProps {
  programs: Program[]
  className?: string
}

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const DAYS: { key: DayKey; label: string; full: string }[] = [
  { key: 'mon', label: 'Lun', full: 'Lunes' },
  { key: 'tue', label: 'Mar', full: 'Martes' },
  { key: 'wed', label: 'Mié', full: 'Miércoles' },
  { key: 'thu', label: 'Jue', full: 'Jueves' },
  { key: 'fri', label: 'Vie', full: 'Viernes' },
  { key: 'sat', label: 'Sáb', full: 'Sábado' },
  { key: 'sun', label: 'Dom', full: 'Domingo' },
]

function getToday(): DayKey {
  return (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as DayKey[])[new Date().getDay()]
}

function getLiveProgram(programs: Program[]): Program | undefined {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return programs.find((p) => {
    const [sh, sm] = p.startTime.split(':').map(Number)
    const [eh, em] = p.endTime.split(':').map(Number)
    return nowMin >= sh * 60 + (sm ?? 0) && nowMin < eh * 60 + (em ?? 0)
  })
}

export function ProgramSchedule({ programs, className }: ProgramScheduleProps) {
  const today = getToday()
  const [selectedDay, setSelectedDay] = useState<DayKey>(today)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll activo al día actual al montar
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeBtn = container.querySelector('[data-active="true"]') as HTMLElement
    activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [])

  const filtered = programs
    .filter((p) => p.days.includes(selectedDay))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Indicador VIVO solo aplica cuando vemos el día de hoy
  const liveProgram = selectedDay === today ? getLiveProgram(filtered) : undefined

  const selectedLabel = DAYS.find((d) => d.key === selectedDay)?.full ?? ''

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Programación</h2>
        <AnimatePresence mode="wait">
          <motion.span
            key={selectedDay}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="text-[var(--color-ink-300)] text-sm"
          >
            {selectedLabel}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Day selector */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DAYS.map((d) => {
          const isActive = d.key === selectedDay
          const isToday = d.key === today
          return (
            <button
              key={d.key}
              data-active={isActive}
              onClick={() => setSelectedDay(d.key)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[var(--color-mag-400)] text-white scale-105'
                  : 'bg-[var(--color-ink-700)] text-[var(--color-ink-300)] hover:bg-[var(--color-ink-600)] hover:text-white'
              )}
            >
              {d.label}
              {isToday && !isActive && (
                <span className="w-1 h-1 rounded-full bg-[var(--color-mag-400)] mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Programs list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-2"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <span className="text-3xl">📅</span>
              <p className="text-[var(--color-ink-400)] text-sm">
                Sin programas para {selectedLabel.toLowerCase()}.
              </p>
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
    </div>
  )
}

function ProgramRow({ program, isLive, index }: { program: Program; isLive: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.18 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border-l-[3px] transition-colors',
        isLive
          ? 'bg-[rgba(255,0,110,0.07)] border-[var(--color-mag-400)]'
          : 'bg-[rgba(255,255,255,0.015)] border-transparent hover:bg-[rgba(255,255,255,0.03)]'
      )}
    >
      <div className="flex flex-col items-center w-12 flex-shrink-0">
        <span className="text-[var(--color-ink-300)] text-xs">{program.startTime}</span>
        <div className="w-px h-3 bg-[var(--color-ink-600)] my-0.5" />
        <span className="text-[var(--color-ink-400)] text-xs">{program.endTime}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('font-semibold text-sm truncate', isLive ? 'text-white' : 'text-[var(--color-ink-100)]')}>
            {program.name}
          </p>
          {isLive && (
            <span className="pulso-badge-live text-[10px] py-0.5 px-2 flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-[var(--color-mag-400)]"
                style={{ animation: 'var(--animate-live-dot)' }} />
              VIVO
            </span>
          )}
        </div>
        <p className="text-[var(--color-ink-400)] text-xs truncate">{program.host}</p>
        {program.description && (
          <p className="text-[var(--color-ink-500)] text-xs mt-0.5 truncate">{program.description}</p>
        )}
      </div>
    </motion.div>
  )
}
