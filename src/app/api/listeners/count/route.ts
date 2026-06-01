import { NextResponse } from 'next/server'
import { getListenerCount } from '@/lib/listenerStore'

export async function GET() {
  return NextResponse.json({ count: getListenerCount() })
}
