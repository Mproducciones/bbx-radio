import type { Program } from '@/types/radio'

export type DayKey = Program['days'][number]

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const WEEKDAY_TO_KEY: Record<string, DayKey> = {
  Sun: 'sun', Mon: 'mon', Tue: 'tue', Wed: 'wed', Thu: 'thu', Fri: 'fri', Sat: 'sat',
}

export function getToday(): DayKey {
  return getTodayInTimezone('America/Santiago')
}

/** Día actual en la zona horaria de la radio (evita desfase SSR en Vercel UTC). */
export function getTodayInTimezone(timezone: string): DayKey {
  const short = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(new Date())
  return WEEKDAY_TO_KEY[short] ?? 'mon'
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m ?? 0)
}

/** Soporta franjas que cruzan medianoche (ej. 20:00 → 00:00). */
export function isTimeInRange(nowMin: number, startMin: number, endMin: number): boolean {
  if (endMin <= startMin) {
    return nowMin >= startMin || nowMin < endMin
  }
  return nowMin >= startMin && nowMin < endMin
}

export function isProgramLiveNow(program: Program, now = new Date()): boolean {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return isTimeInRange(nowMin, timeToMinutes(program.startTime), timeToMinutes(program.endTime))
}

export function getLiveProgram(programs: Program[], now = new Date()): Program | undefined {
  return programs.find(p => isProgramLiveNow(p, now))
}

export function programsForDay(programs: Program[], day: DayKey): Program[] {
  return programs
    .filter(p => p.days.includes(day))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}
