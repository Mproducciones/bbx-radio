import { NextResponse, type NextRequest } from 'next/server'
import { listAppNotifications } from '@/lib/appNotificationsStore'
import { rateLimitByIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  if (!(await rateLimitByIp(req, 'notificationsList'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { items, dbReady, dbError } = await listAppNotifications(40)
    return NextResponse.json({
      items,
      dbReady,
      dbError,
      hint: !dbReady
        ? 'Ejecuta supabase-app-notifications.sql en Supabase y redeploy.'
        : undefined,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    return NextResponse.json({
      items: [],
      dbReady: false,
      dbError: msg,
      hint: 'Revisa SUPABASE_SERVICE_KEY en Vercel.',
    })
  }
}
