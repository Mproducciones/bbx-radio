import { NextResponse, type NextRequest } from 'next/server'
import { listAppNotifications } from '@/lib/appNotificationsStore'
import { getDefaultVisibleHours } from '@/lib/notificationSettings'
import { rateLimitByIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  if (!(await rateLimitByIp(req, 'notificationsList'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { items, dbReady, dbError } = await listAppNotifications(40)
    const isProd = process.env.NODE_ENV === 'production'
    return NextResponse.json({
      items,
      dbReady,
      visibleHoursDefault: getDefaultVisibleHours(),
      ...(isProd ? {} : { dbError }),
      hint: !dbReady && !isProd
        ? 'Ejecuta supabase-app-notifications.sql en Supabase y redeploy.'
        : undefined,
    })
  } catch {
    return NextResponse.json({
      items: [],
      dbReady: false,
    })
  }
}
