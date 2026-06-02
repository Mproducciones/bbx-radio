import { supabaseAdmin } from './supabase'

const RADIO_ID = process.env.NEXT_PUBLIC_RADIO_ID ?? 'bienvenida-933'

export type AdEventType = 'impression' | 'click'

export type AdEventInput = {
  adId: string
  adTipo: string
  eventType: AdEventType
  placement: string
  sessionId?: string
}

type MemEvent = AdEventInput & { recorded_at: string; radio_id: string }

const memEvents: MemEvent[] = []
let memWarned = false

export async function trackAdEvent(input: AdEventInput): Promise<void> {
  if (!input.adId || input.adId === 'demo') return
  // demo-* = campañas de demostración; sí se registran para el panel

  const row = {
    radio_id: RADIO_ID,
    ad_id: input.adId,
    ad_tipo: input.adTipo,
    event_type: input.eventType,
    placement: input.placement,
    session_id: input.sessionId ?? null,
  }

  const { error } = await supabaseAdmin.from('ad_events').insert(row)
  if (!error) return

  if (!memWarned && process.env.NODE_ENV === 'development') {
    memWarned = true
    console.warn('[adEvents] Supabase fallback in-memory — run supabase-setup-v3.sql')
  }
  memEvents.push({ ...input, radio_id: RADIO_ID, recorded_at: new Date().toISOString() })
}

function monthRange(month: string) {
  const [y, m] = month.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, 1)).toISOString()
  const end = new Date(Date.UTC(y, m, 1)).toISOString()
  return { start, end }
}

function aggregateEvents(events: { ad_id: string; ad_tipo: string; event_type: string }[]) {
  const map = new Map<string, { adId: string; adTipo: string; impressions: number; clicks: number }>()
  for (const e of events) {
    const cur = map.get(e.ad_id) ?? { adId: e.ad_id, adTipo: e.ad_tipo, impressions: 0, clicks: 0 }
    if (e.event_type === 'impression') cur.impressions++
    else cur.clicks++
    map.set(e.ad_id, cur)
  }
  return [...map.values()].map(r => ({
    ...r,
    ctr: r.impressions > 0 ? Math.round((r.clicks / r.impressions) * 1000) / 10 : 0,
  }))
}

export async function getAdStats(month?: string) {
  const since = month
    ? monthRange(month).start
    : new Date(Date.now() - 30 * 86400_000).toISOString()
  const until = month ? monthRange(month).end : undefined

  let q = supabaseAdmin
    .from('ad_events')
    .select('ad_id, ad_tipo, event_type')
    .eq('radio_id', RADIO_ID)
    .gte('recorded_at', since)

  if (until) q = q.lt('recorded_at', until)

  const { data, error } = await q

  if (error) {
    const filtered = memEvents.filter(e => e.recorded_at >= since && (!until || e.recorded_at < until))
    return aggregateEvents(filtered.map(e => ({ ad_id: e.adId, ad_tipo: e.adTipo, event_type: e.eventType })))
  }

  return aggregateEvents(data ?? [])
}

export async function getAdTotals(month?: string) {
  const stats = await getAdStats(month)
  return {
    impressions: stats.reduce((s, r) => s + r.impressions, 0),
    clicks: stats.reduce((s, r) => s + r.clicks, 0),
    campaigns: stats.length,
    byAd: stats,
  }
}
