// Registro de oyentes — persistente en Supabase

import { supabaseAdmin } from './supabase'
import { checkRateLimit } from './rateLimit'

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
  if (!(await checkRateLimit('registro', ip))) {
    return { ok: false, position: 0, error: 'Demasiados intentos. Espera unos minutos.' }
  }

  const cleanPhone = data.phone.replace(/\D/g, '')
  if (cleanPhone.length < 8) return { ok: false, position: 0, error: 'Número inválido' }

  const contest = data.contest.trim().slice(0, 64)

  const { data: existing } = await supabaseAdmin
    .from('listener_registrations')
    .select('id')
    .eq('phone', cleanPhone)
    .eq('contest', contest)
    .limit(1)

  if (existing && existing.length > 0) {
    return { ok: false, position: 0, error: 'Ya estás inscrito en este sorteo' }
  }

  const { error } = await supabaseAdmin.from('listener_registrations').insert({
    name: data.name.trim().slice(0, 60),
    phone: cleanPhone,
    contest,
    ip,
  })

  if (error) return { ok: false, position: 0, error: 'Error al registrar. Intenta de nuevo.' }

  const { count } = await supabaseAdmin
    .from('listener_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('contest', contest)

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
