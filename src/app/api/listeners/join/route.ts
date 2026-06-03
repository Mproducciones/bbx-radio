import { NextResponse, type NextRequest } from 'next/server'
import { joinListener } from '@/lib/listenerStore'
import {
  ensureListenerSession,
  attachListenerSessionCookie,
  getListenerSessionFromRequest,
} from '@/lib/listenerSession'
import { checkRateLimit, rateLimitByIp } from '@/lib/rateLimit'
import { guardPublicWrite } from '@/lib/requestGuard'

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  if (!(await rateLimitByIp(req, 'listenerJoin'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  if (!(await checkRateLimit('listenerJoinGlobal', 'all'))) {
    return NextResponse.json({ error: 'Service busy' }, { status: 503 })
  }

  let sessionId = await getListenerSessionFromRequest(req)
  let setCookie = false

  if (!sessionId) {
    const ensured = await ensureListenerSession(req)
    sessionId = ensured.sessionId
    setCookie = ensured.setCookie
  }

  const result = joinListener(sessionId)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 })
  }

  const res = NextResponse.json({ ok: true })
  if (setCookie) await attachListenerSessionCookie(res, sessionId)
  return res
}
