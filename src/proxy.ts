import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '@/lib/adminAuth'
import { rateLimitByIp } from '@/lib/rateLimit'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/') && req.method === 'POST') {
    if (!(await rateLimitByIp(req, 'apiGlobal'))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
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
  matcher: ['/api/:path*', '/studio/:path*'],
}
