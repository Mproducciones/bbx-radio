import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'

export type AdminRole = 'admin' | 'super_admin'

export type AdminSession = {
  username: string
  role: AdminRole
}

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
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
    ['sign']
  )
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
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

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  }
}

export async function createSignedAdminSessionCookie({
  username,
  role = 'admin',
  maxAgeSeconds,
}: {
  username: string
  role?: AdminRole
  maxAgeSeconds: number
}): Promise<NextResponse> {
  const now = Math.floor(Date.now() / 1000)
  const payload = JSON.stringify({ u: username, r: role, iat: now, exp: now + maxAgeSeconds })
  const sig = await sign(payload)
  const value = btoa(payload) + '.' + sig

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, value, cookieOpts(maxAgeSeconds))
  return res
}

export function clearAdminSessionCookie(): NextResponse {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, '', cookieOpts(0))
  return res
}

function resolveSessionRole(username: string, rawRole?: string): AdminRole {
  if (rawRole === 'super_admin') return 'super_admin'
  const superUser = process.env.SUPER_ADMIN_USERNAME
  if (superUser && username === superUser) return 'super_admin'
  return 'admin'
}

export async function getAdminSessionFromRequest(
  req: NextRequest
): Promise<AdminSession | null> {
  const raw = req.cookies.get(SESSION_COOKIE)?.value
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
    const parsed = JSON.parse(payload) as { u: string; r?: string; iat: number; exp: number }
    if (!parsed?.u || typeof parsed.u !== 'string') return null
    // Verificar expiración server-side
    if (!parsed.exp || Math.floor(Date.now() / 1000) > parsed.exp) return null
    return { username: parsed.u, role: resolveSessionRole(parsed.u, parsed.r) }
  } catch {
    return null
  }
}

export function isSuperAdminSession(session: AdminSession): boolean {
  return session.role === 'super_admin'
}

export async function isSuperAdminRequestAuthorized(req: NextRequest): Promise<boolean> {
  const session = await getAdminSessionFromRequest(req)
  if (!session) return false
  return isSuperAdminSession(session)
}

export async function isAdminRequestAuthorized(req: NextRequest): Promise<boolean> {
  const session = await getAdminSessionFromRequest(req)
  if (!session) return false
  if (isSuperAdminSession(session)) return true
  const allowed = process.env.ADMIN_USERNAME
  if (!allowed) return false
  return session.username === allowed
}
