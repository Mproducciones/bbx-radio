import { NextResponse, type NextRequest } from 'next/server'
import {
  ensureListenerSession,
  attachListenerSessionCookie,
  getListenerSessionFromRequest,
} from '@/lib/listenerSession'

export async function GET(req: NextRequest) {
  const { sessionId, setCookie } = await ensureListenerSession(req)
  const res = NextResponse.json({ ok: true })
  if (setCookie) await attachListenerSessionCookie(res, sessionId)
  return res
}
