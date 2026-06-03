import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '@/lib/adminAuth'
import { rateLimitByIp } from '@/lib/rateLimit'
import {
  getSubscriptionRecord,
  isAppAccessible,
  isRouteAllowedWhenSuspended,
} from '@/lib/subscription'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/billing/webhook')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/') && req.method === 'POST') {
    if (!(await rateLimitByIp(req, 'apiGlobal'))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  const sub = await getSubscriptionRecord()
  const blocked = !isAppAccessible(sub.status)

  if (blocked) {
    if (pathname.startsWith('/api/') && !isRouteAllowedWhenSuspended(pathname)) {
      return NextResponse.json(
        { error: 'Servicio suspendido', reason: sub.reason, status: sub.status },
        { status: 402 },
      )
    }
    if (!pathname.startsWith('/api/') && !isRouteAllowedWhenSuspended(pathname)) {
      const url = req.nextUrl.clone()
      url.pathname = '/suspended'
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/studio')) {
    const session = await getAdminSessionFromRequest(req)
    if (!session) {
      return new NextResponse(null, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/studio/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
