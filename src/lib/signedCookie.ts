import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? process.env.AUDIENCE_SESSION_SECRET
  if (!s) throw new Error('Missing ADMIN_SESSION_SECRET')
  return s
}

async function sign(payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function verify(payload: string, sig: string): Promise<boolean> {
  const expected = await sign(payload)
  const a = new TextEncoder().encode(expected)
  const b = new TextEncoder().encode(sig)
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

export function signedCookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export function newSignedSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function readSignedSessionCookie(
  req: NextRequest,
  cookieName: string,
): Promise<string | null> {
  const raw = req.cookies.get(cookieName)?.value
  if (!raw) return null

  const dot = raw.lastIndexOf('.')
  if (dot === -1) return null
  const b64 = raw.slice(0, dot)
  const sig = raw.slice(dot + 1)

  let payload: string
  try {
    payload = atob(b64)
  } catch {
    return null
  }

  if (!(await verify(payload, sig))) return null

  try {
    const parsed = JSON.parse(payload) as { id: string; exp: number }
    if (!parsed?.id || typeof parsed.id !== 'string') return null
    if (!parsed.exp || Math.floor(Date.now() / 1000) > parsed.exp) return null
    return parsed.id
  } catch {
    return null
  }
}

export async function writeSignedSessionCookie(
  res: NextResponse,
  cookieName: string,
  sessionId: string,
  maxAgeSeconds: number,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000)
  const payload = JSON.stringify({ id: sessionId, exp: now + maxAgeSeconds })
  const sig = await sign(payload)
  const value = btoa(payload) + '.' + sig
  res.cookies.set(cookieName, value, signedCookieOpts(maxAgeSeconds))
}
