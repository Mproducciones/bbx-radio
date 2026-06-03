import { NextResponse, type NextRequest } from 'next/server'
import { leaveListener } from '@/lib/listenerStore'
import { getListenerSessionFromRequest } from '@/lib/listenerSession'
import { rateLimitByIp } from '@/lib/rateLimit'
import { guardPublicWrite } from '@/lib/requestGuard'

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  if (!(await rateLimitByIp(req, 'listenerJoin'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const sessionId = await getListenerSessionFromRequest(req)
  if (sessionId) leaveListener(sessionId)
  return NextResponse.json({ ok: true })
}
