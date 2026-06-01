import { NextResponse } from 'next/server'
import { getListenerCount } from '@/lib/listenerStore'
import { trackListenerCount } from '@/lib/analyticsStore'

export async function GET() {
  const count = getListenerCount()
  // Guarda en Supabase (throttled a 1 vez cada 20 min)
  trackListenerCount(count).catch(() => {})
  return NextResponse.json({ count })
}
