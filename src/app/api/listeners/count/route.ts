import { NextResponse, type NextRequest } from 'next/server'
import { getListenerCount } from '@/lib/listenerStore'
import { trackListenerCount } from '@/lib/analyticsStore'
import { rateLimitByIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  if (!(await rateLimitByIp(req, 'listenerCount'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const count = getListenerCount()
  trackListenerCount(count).catch(() => {})
  return NextResponse.json({ count })
}
