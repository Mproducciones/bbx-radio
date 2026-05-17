import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '@/lib/adminAuth'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/studio')) {
    const session = await getAdminSessionFromRequest(req)
    if (!session) {
      return new NextResponse(null, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*'],
}
