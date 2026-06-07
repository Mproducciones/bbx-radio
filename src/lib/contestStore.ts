import { supabaseAdmin } from './supabase'

export type Contest = {
  id: string
  slug: string
  title: string
  prize: string
  description: string | null
  sponsor_name: string | null
  sponsor_ad_id: string | null
  banner_image_url: string | null
  deadline: string | null
  active: boolean
  created_at: string
}

const DEFAULT: Contest = {
  id: 'default',
  slug: 'sorteo-bienvenida',
  title: 'Sorteo en vivo',
  prize: 'Premio sorpresa de un patrocinador',
  description: 'Regístrate y el locutor anuncia al ganador en la programación.',
  sponsor_name: 'Patrocinador Bienvenida',
  sponsor_ad_id: null,
  banner_image_url: null,
  deadline: 'Esta semana',
  active: true,
  created_at: new Date().toISOString(),
}

let memContests: Contest[] = [{ ...DEFAULT }]
let memWarned = false

function rowToContest(r: Record<string, unknown>): Contest {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    prize: String(r.prize),
    description: r.description ? String(r.description) : null,
    sponsor_name: r.sponsor_name ? String(r.sponsor_name) : null,
    sponsor_ad_id: r.sponsor_ad_id ? String(r.sponsor_ad_id) : null,
    banner_image_url: r.banner_image_url ? String(r.banner_image_url) : null,
    deadline: r.deadline ? String(r.deadline) : null,
    active: Boolean(r.active),
    created_at: String(r.created_at ?? new Date().toISOString()),
  }
}

async function useMemFallback() {
  if (!memWarned && process.env.NODE_ENV === 'development') {
    memWarned = true
    console.warn('[contests] Supabase fallback in-memory — run supabase-setup-v3.sql')
  }
}

export async function getActiveContest(): Promise<Contest | null> {
  const { data, error } = await supabaseAdmin
    .from('contests')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    await useMemFallback()
    return memContests.find(c => c.active) ?? null
  }
  return data ? rowToContest(data) : memContests.find(c => c.active) ?? null
}

export async function listContests(): Promise<Contest[]> {
  const { data, error } = await supabaseAdmin
    .from('contests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    await useMemFallback()
    return [...memContests]
  }
  return (data ?? []).map(rowToContest)
}

export async function createContest(input: {
  slug: string
  title: string
  prize: string
  description?: string
  sponsor_name?: string
  sponsor_ad_id?: string
  banner_image_url?: string
  deadline?: string
  active?: boolean
}): Promise<Contest | null> {
  if (input.active) {
    await supabaseAdmin.from('contests').update({ active: false }).eq('active', true)
    memContests = memContests.map(c => ({ ...c, active: false }))
  }

  const row = {
    slug: input.slug,
    title: input.title,
    prize: input.prize,
    description: input.description ?? null,
    sponsor_name: input.sponsor_name ?? null,
    sponsor_ad_id: input.sponsor_ad_id ?? null,
    banner_image_url: input.banner_image_url ?? null,
    deadline: input.deadline ?? null,
    active: input.active ?? false,
  }

  const { data, error } = await supabaseAdmin.from('contests').insert(row).select('*').single()

  if (error) {
    await useMemFallback()
    const c: Contest = {
      id: crypto.randomUUID(),
      ...row,
      description: row.description,
      sponsor_name: row.sponsor_name,
      sponsor_ad_id: row.sponsor_ad_id,
      banner_image_url: row.banner_image_url,
      deadline: row.deadline,
      created_at: new Date().toISOString(),
    }
    memContests.unshift(c)
    return c
  }
  return rowToContest(data)
}

export async function setContestActive(id: string, active: boolean): Promise<boolean> {
  if (active) {
    await supabaseAdmin.from('contests').update({ active: false }).neq('id', id)
    memContests = memContests.map(c => ({ ...c, active: c.id === id }))
  }

  const { error } = await supabaseAdmin.from('contests').update({ active }).eq('id', id)
  if (error) {
    await useMemFallback()
    const idx = memContests.findIndex(c => c.id === id)
    if (idx === -1) return false
    if (active) memContests = memContests.map((c, i) => ({ ...c, active: i === idx }))
    else memContests[idx].active = false
    return true
  }
  return true
}
