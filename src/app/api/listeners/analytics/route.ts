import { NextResponse, type NextRequest } from 'next/server'
import { getListenerTimeSeries, getListenerPeak } from '@/lib/analyticsStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const authorized = await isAdminRequestAuthorized(req)
  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const hours = Number(new URL(req.url).searchParams.get('hours') ?? '24')
  const [series, peak] = await Promise.all([
    getListenerTimeSeries(hours),
    getListenerPeak(hours),
  ])

  return NextResponse.json({ series, peak })
}
