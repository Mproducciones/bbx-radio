import { NextResponse } from 'next/server'
import { createSignedAdminSessionCookie } from '@/lib/adminAuth'

// In-memory rate limit: max 10 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > MAX_ATTEMPTS) return true

  return false
}

async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder()
  const ka = await crypto.subtle.importKey('raw', enc.encode(a), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const kb = await crypto.subtle.importKey('raw', enc.encode(b), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const nonce = crypto.getRandomValues(new Uint8Array(32))
  const [sa, sb] = await Promise.all([
    crypto.subtle.sign('HMAC', ka, nonce),
    crypto.subtle.sign('HMAC', kb, nonce),
  ])
  const va = new Uint8Array(sa)
  const vb = new Uint8Array(sb)
  let diff = 0
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i]
  return diff === 0
}

function isValidOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host) return true // same-origin requests without Origin header
  try {
    const originHost = new URL(origin).host
    return originHost === host
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  try {
    const body = (await req.json()) as { username?: string; password?: string }
    const username = body?.username?.toString() ?? ''
    const password = body?.password?.toString() ?? ''

    const allowedUsername = process.env.ADMIN_USERNAME
    const allowedPassword = process.env.ADMIN_PASSWORD

    if (!allowedUsername || !allowedPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const [userOk, passOk] = await Promise.all([
      constantTimeEqual(username, allowedUsername),
      constantTimeEqual(password, allowedPassword),
    ])

    if (!userOk || !passOk) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return await createSignedAdminSessionCookie({ username, maxAgeSeconds: 60 * 60 * 24 * 7 })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
