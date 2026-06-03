import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { rateLimitByIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  if (!(await rateLimitByIp(req, 'listenerCount'))) {
    return NextResponse.json({ authorized: false }, { status: 429 })
  }
  const authorized = await isAdminRequestAuthorized(req)
  return NextResponse.json({ authorized })
}
