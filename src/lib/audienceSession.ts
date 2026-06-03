import type { NextRequest } from 'next/server'
import {
  newSignedSessionId,
  readSignedSessionCookie,
  writeSignedSessionCookie,
} from '@/lib/signedCookie'

const VOTE_COOKIE = 'pulso_vote'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export async function getAudienceSessionFromRequest(req: NextRequest): Promise<string | null> {
  return readSignedSessionCookie(req, VOTE_COOKIE)
}

export async function ensureAudienceSession(
  req: NextRequest,
): Promise<{ sessionId: string; setCookie: boolean }> {
  const existing = await getAudienceSessionFromRequest(req)
  if (existing) return { sessionId: existing, setCookie: false }
  return { sessionId: newSignedSessionId(), setCookie: true }
}

export async function attachAudienceSessionCookie(
  res: import('next/server').NextResponse,
  sessionId: string,
): Promise<void> {
  await writeSignedSessionCookie(res, VOTE_COOKIE, sessionId, MAX_AGE_SECONDS)
}
