'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic2, Radio, CalendarOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Program } from '@/types/radio'

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const DAYS: { key: DayKey; label: string; full: string }[] = [
  { key: 'mon', label: 'L', full: 'Lunes' },
  { key: 'tue', label: 'M', full: 'Martes' },
  { key: 'wed', label: 'X', full: 'Miércoles' },
  { key: 'thu', label: 'J', full: 'Jueves' },
  { key: 'fri', label: 'V', full: 'Viernes' },
  { key: 'sat', label: 'S', full: 'Sábado' },
  { key: 'sun', label: 'D', full: 'Domingo' },
]

function getToday(): DayKey {
  return (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as DayKey[])[new Date().getDay()]
}

function getLiveProgram(programs: Program[]): Program | undefined {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return programs.find(p => {
    const [sh, sm] = p.startTime.split(':').map(Number)
    const [eh, em] = p.endTime.split(':').map(Number)
    return nowMin >= sh * 60 + (sm ?? 0) && nowMin < eh * 60 + (em ?? 0)
  })
}

export function ProgramSchedule({ programs, className }: { programs: Program[]; className?: string }) {
  const [today, setToday]           = useState<DayKey>('mon')
  const [selectedDay, setSelectedDay] = useState<DayKey>('mon')

  useEffect(() => {
    const d = getToday()
    setToday(d); setSelectedDay(d)
  }, [])

  const filtered     = programs.filter(p => p.days.includes(selectedDay)).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const liveProgram  = selectedDay === today ? getLiveProgram(filtered) : undefined
  const selectedFull = DAYS.find(d => d.key === selectedDay)?.full ?? ''

  return (
    <div className={cn('flex flex-col gap-4', className)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,0,110,0.12)' }}>
            <Radio className="w-4 h-4" style={{ color: 'var(--color-mag-400)' }} />
          </div>
          <h2 className="font-display text-2xl text-white leading-none">Programación</h2>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={selectedDay} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-ink-300)' }}>
            {selectedFull}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Day selector */}
      <div className="flex items-center p-1 rounded-2xl gap-0.5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {DAYS.map(d => {
          const isActive = d.key === selectedDay
          const isToday  = d.key === today
          return (
            <motion.button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              whileTap={{ scale: 0.92 }}
              className="relative flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-bold transition-colors"
              style={isActive
                ? { background: 'var(--color-mag-400)', color: '#fff' }
                : { color: 'var(--color-ink-400)' }
              }
            >
              {isToday && !isActive && (
                <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-mag-400)' }} />
              )}
              {d.label}
            </motion.button>
          )
        })}
      </div>

      {/* Programs */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={selectedDay} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }} className="flex flex-col gap-2">

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <CalendarOff className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/30 text-sm">Sin programas para {selectedFull.toLowerCase()}</p>
            </div>
          ) : (
            filtered.map((program, i) => (
              <ProgramRow key={program.id} program={program} isLive={program.id === liveProgram?.id} index={i} />
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="relative flex items-center gap-3 p-3.5 rounded-2xl overflow-hidden"
      style={isLive
        ? { background: 'rgba(255,0,110,0.06)', border: '1px solid rgba(255,0,110,0.2)' }
        : { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }
      }
    >
      {/* Accent left bar */}
      {isLive && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
          style={{ background: 'var(--color-mag-400)' }} />
      )}

      {/* Mic icon */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={isLive
          ? { background: 'rgba(255,0,110,0.15)' }
          : { background: 'rgba(255,255,255,0.05)' }
        }>
        <Mic2 className="w-4 h-4" style={{ color: isLive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-sm truncate" style={{ color: isLive ? '#fff' : 'rgba(255,255,255,0.8)' }}>
            {program.name}
          </p>
          {isLive && (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest flex-shrink-0 px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--color-mag-400)', color: '#fff' }}>
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              VIVO
            </span>
          )}
        </div>
        {program.host && program.host !== 'Por confirmar' && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{program.host}</p>
        )}
      </div>

      {/* Time */}
      <div className="flex flex-col items-end flex-shrink-0 text-right">
        <span className="text-xs font-semibold" style={{ color: isLive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.4)' }}>
          {program.startTime}
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{program.endTime}</span>
      </div>
    </motion.div>
  )
}
