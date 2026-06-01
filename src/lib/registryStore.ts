// Registro de oyentes — persistente en Supabase

import { supabaseAdmin } from './supabase'

// IP rate limit en memoria (no necesita persistencia)
const ipLog = new Map<string, Set<string>>()

export interface Listener {
  id: string
  name: string
  phone: string
  contest: string
  registered_at: string
}

export async function register(
  data: { name: string; phone: string; contest: string },
  ip: string,
): Promise<{ ok: boolean; position: number; error?: string }> {
  const cleanPhone = data.phone.replace(/\D/g, '')
  if (cleanPhone.length < 8) return { ok: false, position: 0, error: 'Número inválido' }

  if (!ipLog.has(ip)) ipLog.set(ip, new Set())
  const contests = ipLog.get(ip)!
  if (contests.has(data.contest)) return { ok: false, position: 0, error: 'Ya estás inscrito en este sorteo' }
  contests.add(data.contest)

  const { error } = await supabaseAdmin.from('listener_registrations').insert({
    name: data.name.trim().slice(0, 60),
    phone: cleanPhone,
    contest: data.contest,
    ip,
  })

  if (error) return { ok: false, position: 0, error: 'Error al registrar. Intenta de nuevo.' }

  const { count } = await supabaseAdmin
    .from('listener_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('contest', data.contest)

  return { ok: true, position: count ?? 1 }
}

export async function getAll(): Promise<Listener[]> {
  const { data } = await supabaseAdmin
    .from('listener_registrations')
    .select('*')
    .order('registered_at', { ascending: false })
  return (data ?? []) as Listener[]
}

export async function getStats() {
  const { data } = await supabaseAdmin
    .from('listener_registrations')
    .select('contest')

  const byContest: Record<string, number> = {}
  for (const r of data ?? []) {
    byContest[r.contest] = (byContest[r.contest] ?? 0) + 1
  }
  return { total: (data ?? []).length, byContest }
}
