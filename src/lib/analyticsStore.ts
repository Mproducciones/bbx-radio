// Tracking estratégico — lo que cierra ventas y escala el negocio

import { supabaseAdmin } from './supabase'

const RADIO_ID = process.env.NEXT_PUBLIC_RADIO_ID ?? 'bienvenida-933'

// Throttle: guardar máximo 1 snapshot cada 20 minutos
let lastSaved = 0

export async function trackListenerCount(count: number): Promise<void> {
  const now = Date.now()
  if (now - lastSaved < 20 * 60_000) return  // throttle
  lastSaved = now

  await supabaseAdmin.from('listener_counts').insert({
    radio_id: RADIO_ID,
    count,
  })
}

export async function getListenerTimeSeries(hours = 24): Promise<{ recorded_at: string; count: number }[]> {
  const since = new Date(Date.now() - hours * 3_600_000).toISOString()

  const { data } = await supabaseAdmin
    .from('listener_counts')
    .select('recorded_at, count')
    .eq('radio_id', RADIO_ID)
    .gte('recorded_at', since)
    .order('recorded_at', { ascending: true })

  return (data ?? []) as { recorded_at: string; count: number }[]
}

export async function getListenerPeak(hours = 24): Promise<number> {
  const since = new Date(Date.now() - hours * 3_600_000).toISOString()
  const { data } = await supabaseAdmin
    .from('listener_counts')
    .select('count')
    .eq('radio_id', RADIO_ID)
    .gte('recorded_at', since)
    .order('count', { ascending: false })
    .limit(1)

  return data?.[0]?.count ?? 0
}

export async function savePollResult(poll: {
  id: string
  question: string
  options: [{ title: string; artist: string; votes: number }, { title: string; artist: string; votes: number }]
  totalVotes: number
}): Promise<void> {
  await supabaseAdmin.from('poll_results').upsert({
    id:              poll.id,
    radio_id:        RADIO_ID,
    question:        poll.question,
    option_a_title:  poll.options[0].title,
    option_a_artist: poll.options[0].artist,
    option_a_votes:  poll.options[0].votes,
    option_b_title:  poll.options[1].title,
    option_b_artist: poll.options[1].artist,
    option_b_votes:  poll.options[1].votes,
    total_votes:     poll.totalVotes,
  })
}

export async function getPollHistory(limit = 10) {
  const { data } = await supabaseAdmin
    .from('poll_results')
    .select('*')
    .eq('radio_id', RADIO_ID)
    .order('closed_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
