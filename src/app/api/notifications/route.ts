import { NextResponse, type NextRequest } from 'next/server'
import { listAppNotifications } from '@/lib/appNotificationsStore'
import { rateLimitByIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  if (!(await rateLimitByIp(req, 'notificationsList'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const items = await listAppNotifications(40)
    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
