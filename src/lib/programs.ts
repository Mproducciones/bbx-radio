import { cookies } from 'next/headers'
import { fetchProgramas } from '@/lib/api'
import { PROGRAMS } from '@/lib/radioConfig'
import { isSanityConfigured, sanityClient } from '@/lib/sanity'
import { pickExclusiveClientKey, isExclusiveCampaign, clientKey } from '@/lib/adExclusivity'
import { FEATURED_PROGRAM } from '@/lib/radioAdBranding'
import { getTierPreview } from '@/lib/sponsorAdTiers'
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
    sponsor:
      p.patrocinadorCliente && String(p.patrocinadorCliente).trim()
        ? {
            cliente: String(p.patrocinadorCliente).trim(),
            colorAccent: p.patrocinadorColor ? String(p.patrocinadorColor) : undefined,
          }
        : undefined,
  }
}

async function exclusiveSponsorFromAds(): Promise<Program['sponsor'] | undefined> {
  const cookieStore = await cookies()
  const tier = cookieStore.get('pulso_sponsor_demo_tier')?.value
  if (tier === 'empresarial') {
    const p = getTierPreview('empresarial')
    return { cliente: p.cliente, colorAccent: p.color }
  }

  if (!isSanityConfigured()) return undefined

  try {
    const now = new Date().toISOString()
    const rows = await sanityClient.fetch<
      {
        cliente?: string
        nombre?: string
        prioridad?: number
        planContratado?: string
        exclusivoApp?: boolean
        colorAccent?: string
      }[]
    >(
      `*[_type == "publicidad" && activo == true && fechaInicio <= $now && fechaFin >= $now]{
        cliente, nombre, prioridad, planContratado, exclusivoApp, colorAccent
      }`,
      { now },
    )
    const key = pickExclusiveClientKey(rows ?? [])
    if (!key) return undefined
    const winner = (rows ?? [])
      .filter(isExclusiveCampaign)
      .sort((a, b) => (b.prioridad ?? 0) - (a.prioridad ?? 0))
      .find(a => clientKey(a) === key)
    if (!winner) return undefined
    const cliente = (winner.cliente || winner.nombre || '').trim()
    if (!cliente) return undefined
    return { cliente, colorAccent: winner.colorAccent }
  } catch {
    return undefined
  }
}

function injectFeaturedSponsor(programs: Program[], sponsor: Program['sponsor']): Program[] {
  if (!sponsor) return programs
  const featuredName = FEATURED_PROGRAM.name
  return programs.map(p => {
    if (p.name === featuredName && !p.sponsor) {
      return { ...p, sponsor }
    }
    return p
  })
}

/** Sanity Studio si hay documentos; si no, parrilla en `radioConfig.ts`. */
export async function getPrograms(): Promise<Program[]> {
  const injected = await exclusiveSponsorFromAds()

  if (!isSanityConfigured()) {
    return injectFeaturedSponsor(PROGRAMS, injected)
  }

  try {
    const rows = await fetchProgramas()
    if (!Array.isArray(rows) || rows.length === 0) {
      return injectFeaturedSponsor(PROGRAMS, injected)
    }

    const programs = rows
      .map(normalizeProgram)
      .filter((p): p is Program => p !== null)

    const base = programs.length > 0 ? programs : PROGRAMS
    return injectFeaturedSponsor(base, injected)
  } catch {
    return injectFeaturedSponsor(PROGRAMS, injected)
  }
}
