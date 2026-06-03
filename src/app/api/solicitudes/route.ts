import { NextResponse, type NextRequest } from 'next/server'
import { addRequest, getQueue, getQueuePosition } from '@/lib/songRequestStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { getClientIp } from '@/lib/rateLimit'
import {
  guardPublicWrite,
  readJsonBody,
  isHoneypotClean,
  honeypotTriggered,
} from '@/lib/requestGuard'

export async function GET(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const queue = await getQueue()
  return NextResponse.json(queue)
}

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  const ip = getClientIp(req)
  const body = await readJsonBody(req)

  if (!isHoneypotClean(body)) return honeypotTriggered()
  if (!body || typeof body.song !== 'string' || typeof body.artist !== 'string') {
    return NextResponse.json({ error: 'song y artist son requeridos' }, { status: 400 })
  }

  const result = await addRequest(
    {
      song: body.song,
      artist: body.artist,
      dedication: typeof body.dedication === 'string' ? body.dedication : undefined,
    },
    ip,
  )

  if (!result.ok) {
    const status = result.error?.includes('Demasiadas') ? 429 : 400
    return NextResponse.json({ error: result.error }, { status })
  }
  const position = await getQueuePosition(result.request!.id)
  return NextResponse.json({ ...result.request, position }, { status: 201 })
}
