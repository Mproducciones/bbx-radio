import { NextResponse, type NextRequest } from 'next/server'
import { trackAdEvent } from '@/lib/adEventsStore'
import { rateLimitByIp } from '@/lib/rateLimit'
import { guardPublicWrite, readJsonBody } from '@/lib/requestGuard'

const ALLOWED_EVENTS = new Set(['impression', 'click'])

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  if (!(await rateLimitByIp(req, 'adEvents'))) {
    return NextResponse.json({ ok: true })
  }

  const body = await readJsonBody(req)
  if (!body?.adId || !body?.adTipo || !body?.eventType || !body?.placement) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const eventType = String(body.eventType)
  if (!ALLOWED_EVENTS.has(eventType)) {
    return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
  }

  await trackAdEvent({
    adId: String(body.adId).slice(0, 80),
    adTipo: String(body.adTipo).slice(0, 40),
    eventType: eventType as 'impression' | 'click',
    placement: String(body.placement).slice(0, 40),
    sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
  })

  return NextResponse.json({ ok: true })
}
