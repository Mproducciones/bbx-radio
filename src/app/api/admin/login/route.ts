import { NextResponse } from 'next/server'
import { createSignedAdminSessionCookie } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { username?: string; password?: string }
    const username = body?.username?.toString() ?? ''
    const password = body?.password?.toString() ?? ''

    const allowedUsername = process.env.ADMIN_USERNAME
    const allowedPassword = process.env.ADMIN_PASSWORD

    if (!allowedUsername || !allowedPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    if (username !== allowedUsername || password !== allowedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return await createSignedAdminSessionCookie({ username, maxAgeSeconds: 60 * 60 * 24 * 7 })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
