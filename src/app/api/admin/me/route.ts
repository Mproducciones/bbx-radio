import { NextResponse, type NextRequest } from 'next/server'
import {
  getAdminSessionFromRequest,
  isAdminRequestAuthorized,
  isSuperAdminSession,
} from '@/lib/adminAuth'
import { rateLimitByIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  if (!(await rateLimitByIp(req, 'listenerCount'))) {
    return NextResponse.json({ authorized: false, superAdmin: false }, { status: 429 })
  }
  const session = await getAdminSessionFromRequest(req)
  const authorized = await isAdminRequestAuthorized(req)
  const superAdmin = session ? isSuperAdminSession(session) : false
  return NextResponse.json({ authorized, superAdmin })
}
