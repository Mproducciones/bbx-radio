// Cola de solicitudes de canciones — persistente en Supabase

import { supabaseAdmin } from './supabase'
import { checkRateLimit } from './rateLimit'

export interface SongRequest {
  id: string
  song: string
  artist: string
  dedication?: string
  submittedAt: string
  status: 'pending' | 'approved' | 'played' | 'rejected'
}

export async function addRequest(
  data: Pick<SongRequest, 'song' | 'artist' | 'dedication'>,
  ip: string,
): Promise<{ ok: boolean; request?: SongRequest; error?: string }> {
  if (!(await checkRateLimit('songRequest', ip))) {
    return { ok: false, error: 'Demasiadas solicitudes. Espera unos minutos.' }
  }

  const id = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const { error } = await supabaseAdmin.from('song_requests').insert({
    id,
    song:       data.song.slice(0, 120),
    artist:     data.artist.slice(0, 80),
    dedication: data.dedication?.slice(0, 200),
    status:     'pending',
  })

  if (error) return { ok: false, error: 'Error al enviar.' }

  const req: SongRequest = {
    id, song: data.song, artist: data.artist,
    dedication: data.dedication,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  }
  return { ok: true, request: req }
}

export async function getQueue(): Promise<SongRequest[]> {
  const { data } = await supabaseAdmin
    .from('song_requests')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(50)
  return (data ?? []).map(r => ({
    id: r.id, song: r.song, artist: r.artist,
    dedication: r.dedication,
    submittedAt: r.submitted_at,
    status: r.status,
  }))
}

export async function getPending(): Promise<SongRequest[]> {
  const { data } = await supabaseAdmin
    .from('song_requests')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true })
  return (data ?? []).map(r => ({
    id: r.id, song: r.song, artist: r.artist,
    dedication: r.dedication,
    submittedAt: r.submitted_at,
    status: r.status,
  }))
}

export async function getQueuePosition(id: string): Promise<number> {
  const pending = await getPending()
  const i = pending.findIndex(r => r.id === id)
  return i === -1 ? -1 : i + 1
}

export async function updateStatus(id: string, status: SongRequest['status']): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('song_requests')
    .update({ status })
    .eq('id', id)
  return !error
}
