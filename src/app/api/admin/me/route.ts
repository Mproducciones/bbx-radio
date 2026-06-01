import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

const checks = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = checks.get(ip)
  if (!entry || now > entry.resetAt) {
    checks.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  entry.count++
  return entry.count > 30
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) return NextResponse.json({ authorized: false }, { status: 429 })
  const authorized = await isAdminRequestAuthorized(req)
  return NextResponse.json({ authorized })
}
