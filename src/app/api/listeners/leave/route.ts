import { NextResponse } from 'next/server'
import { leaveListener } from '@/lib/listenerStore'

export async function POST(req: Request) {
  const { sessionId } = await req.json().catch(() => ({}))
  if (sessionId && typeof sessionId === 'string') {
    leaveListener(sessionId.slice(0, 64))
  }
  return NextResponse.json({ ok: true })
}
