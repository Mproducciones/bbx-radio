import { NextResponse, type NextRequest } from 'next/server'
import { trackAdEvent } from '@/lib/adEventsStore'

const ALLOWED_EVENTS = new Set(['impression', 'click'])
const ipLog = new Map<string, number[]>()

function rateLimit(ip: string, max = 120, windowMs = 60_000) {
  const now = Date.now()
  const hits = (ipLog.get(ip) ?? []).filter(t => now - t < windowMs)
  if (hits.length >= max) return false
  hits.push(now)
  ipLog.set(ip, hits)
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip)) return NextResponse.json({ ok: true })

  const body = await req.json().catch(() => null)
  if (!body?.adId || !body?.adTipo || !body?.eventType || !body?.placement) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  if (!ALLOWED_EVENTS.has(body.eventType)) {
    return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
  }

  await trackAdEvent({
    adId: String(body.adId).slice(0, 80),
    adTipo: String(body.adTipo).slice(0, 40),
    eventType: body.eventType,
    placement: String(body.placement).slice(0, 40),
    sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
  })

  return NextResponse.json({ ok: true })
}
