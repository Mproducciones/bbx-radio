import type { NextRequest } from 'next/server'
import {
  newSignedSessionId,
  readSignedSessionCookie,
  writeSignedSessionCookie,
} from '@/lib/signedCookie'

const LISTEN_COOKIE = 'pulso_listen'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export async function getListenerSessionFromRequest(req: NextRequest): Promise<string | null> {
  return readSignedSessionCookie(req, LISTEN_COOKIE)
}

export async function ensureListenerSession(
  req: NextRequest,
): Promise<{ sessionId: string; setCookie: boolean }> {
  const existing = await getListenerSessionFromRequest(req)
  if (existing) return { sessionId: existing, setCookie: false }
  return { sessionId: newSignedSessionId(), setCookie: true }
}

export async function attachListenerSessionCookie(
  res: import('next/server').NextResponse,
  sessionId: string,
): Promise<void> {
  await writeSignedSessionCookie(res, LISTEN_COOKIE, sessionId, MAX_AGE_SECONDS)
}
