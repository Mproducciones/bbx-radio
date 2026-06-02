import { fetchProgramas } from '@/lib/api'
import { PROGRAMS } from '@/lib/radioConfig'
import { isSanityConfigured } from '@/lib/sanity'
import type { Program } from '@/types/radio'

const VALID_DAYS = new Set<Program['days'][number]>([
  'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
])

function normalizeProgram(raw: unknown): Program | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  if (!p.id || !p.name || !p.startTime || !p.endTime) return null

  const days = Array.isArray(p.days)
    ? p.days.filter((d): d is Program['days'][number] => VALID_DAYS.has(d as Program['days'][number]))
    : []
  if (days.length === 0) return null

  return {
    id: String(p.id),
    name: String(p.name),
    host: String(p.host ?? 'Por confirmar'),
    startTime: String(p.startTime),
    endTime: String(p.endTime),
    days,
    description: p.description ? String(p.description) : undefined,
    imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
  }
}

/** Sanity Studio si hay documentos; si no, parrilla en `radioConfig.ts`. */
export async function getPrograms(): Promise<Program[]> {
  if (!isSanityConfigured()) return PROGRAMS

  try {
    const rows = await fetchProgramas()
    if (!Array.isArray(rows) || rows.length === 0) return PROGRAMS

    const programs = rows
      .map(normalizeProgram)
      .filter((p): p is Program => p !== null)

    return programs.length > 0 ? programs : PROGRAMS
  } catch {
    return PROGRAMS
  }
}
