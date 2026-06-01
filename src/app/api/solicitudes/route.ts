import { NextResponse } from 'next/server'
import { addRequest, getQueue } from '@/lib/songRequestStore'

// Restrict: max 3 requests from same IP per 10 min
const ipLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = 10 * 60_000
  const hits = (ipLog.get(ip) ?? []).filter(t => now - t < window)
  if (hits.length >= 3) return true
  ipLog.set(ip, [...hits, now])
  return false
}

export async function GET() {
  return NextResponse.json(getQueue())
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Espera unos minutos.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body.song !== 'string' || typeof body.artist !== 'string') {
    return NextResponse.json({ error: 'song y artist son requeridos' }, { status: 400 })
  }

  const req2 = addRequest({
    song: body.song,
    artist: body.artist,
    dedication: typeof body.dedication === 'string' ? body.dedication : undefined,
  })

  return NextResponse.json(req2, { status: 201 })
}
