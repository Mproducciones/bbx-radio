import { NextResponse, type NextRequest } from 'next/server'
import { addRequest, getQueue } from '@/lib/songRequestStore'

export async function GET() {
  const queue = await getQueue()
  return NextResponse.json(queue)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const body = await req.json().catch(() => null)

  if (!body || typeof body.song !== 'string' || typeof body.artist !== 'string') {
    return NextResponse.json({ error: 'song y artist son requeridos' }, { status: 400 })
  }

  const result = await addRequest(
    { song: body.song, artist: body.artist, dedication: body.dedication },
    ip,
  )

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error?.includes('Demasiadas') ? 429 : 400 })
  return NextResponse.json(result.request, { status: 201 })
}
