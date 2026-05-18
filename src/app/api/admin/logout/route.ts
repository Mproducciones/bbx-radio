import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/adminAuth'

function isValidOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return clearAdminSessionCookie()
}
