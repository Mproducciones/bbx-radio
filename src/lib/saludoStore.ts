import { supabaseAdmin } from './supabase'
export { MOTIVOS, type MotivoId, type Saludo } from './saludoTypes'
import type { Saludo, MotivoId } from './saludoTypes'

// IP rate limit en memoria
const ipLog = new Map<string, number[]>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (ipLog.get(ip) ?? []).filter(t => now - t < 10 * 60_000)
  if (hits.length >= 5) return true
  ipLog.set(ip, [...hits, now])
  return false
}

export async function addSaludo(
  data: Omit<Saludo, 'id' | 'status' | 'submitted_at'>,
  ip: string,
): Promise<{ ok: boolean; error?: string }> {
  if (isRateLimited(ip)) return { ok: false, error: 'Demasiados saludos. Espera unos minutos.' }

  const { error } = await supabaseAdmin.from('saludos').insert({
    para:    data.para.trim().slice(0, 80),
    motivo:  data.motivo,
    de:      data.de.trim().slice(0, 60),
    mensaje: data.mensaje?.trim().slice(0, 120),
    cancion: data.cancion?.trim().slice(0, 100),
    artista: data.artista?.trim().slice(0, 80),
    status:  'pending',
  })

  if (error) return { ok: false, error: 'No se pudo enviar. Intenta de nuevo.' }
  return { ok: true }
}

export async function getSaludos(): Promise<Saludo[]> {
  const { data } = await supabaseAdmin
    .from('saludos')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(60)
  return (data ?? []) as Saludo[]
}

export async function updateSaludoStatus(id: string, status: Saludo['status']): Promise<boolean> {
  const { error } = await supabaseAdmin.from('saludos').update({ status }).eq('id', id)
  return !error
}
