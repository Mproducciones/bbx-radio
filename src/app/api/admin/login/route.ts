import { NextResponse } from 'next/server'
import { createSignedAdminSessionCookie } from '@/lib/adminAuth'
import { getClientIp, checkRateLimit } from '@/lib/rateLimit'
import { isValidOrigin } from '@/lib/requestGuard'

const SESSION_MAX_AGE = 60 * 60 * 24 // 24 horas

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

export async function POST(req: Request) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)

  if (!(await checkRateLimit('adminLogin', ip))) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  try {
    const body = (await req.json()) as { username?: string; password?: string }
    const username = (body?.username?.toString() ?? '').slice(0, 256)
    const password = (body?.password?.toString() ?? '').slice(0, 256)

    const allowedUsername = process.env.ADMIN_USERNAME
    const allowedPassword = process.env.ADMIN_PASSWORD

    if (!allowedUsername || !allowedPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    if (allowedPassword.length < 12) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const [userOk, passOk] = await Promise.all([
      constantTimeEqual(username, allowedUsername),
      constantTimeEqual(password, allowedPassword),
    ])

    if (!userOk || !passOk) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return await createSignedAdminSessionCookie({ username, maxAgeSeconds: SESSION_MAX_AGE })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
