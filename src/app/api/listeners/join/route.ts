import { NextResponse } from 'next/server'
import { joinListener } from '@/lib/listenerStore'

export async function POST(req: Request) {
  const { sessionId } = await req.json().catch(() => ({}))
  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  joinListener(sessionId.slice(0, 64))
  return NextResponse.json({ ok: true })
}
