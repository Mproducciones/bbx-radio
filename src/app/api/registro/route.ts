import { NextResponse, type NextRequest } from 'next/server'
import { register, getAll, getStats } from '@/lib/registryStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { getClientIp } from '@/lib/rateLimit'
import {
  guardPublicWrite,
  readJsonBody,
  isHoneypotClean,
  honeypotTriggered,
} from '@/lib/requestGuard'

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  const ip = getClientIp(req)
  const body = await readJsonBody(req)

  if (!isHoneypotClean(body)) return honeypotTriggered()
  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: 'name y phone requeridos' }, { status: 400 })
  }

  const result = await register(
    {
      name: String(body.name),
      phone: String(body.phone),
      contest: body.contest ? String(body.contest) : 'general',
    },
    ip,
  )

  if (!result.ok) {
    const status = result.error?.includes('Demasiados') || result.error?.includes('intentos') ? 429 : 400
    return NextResponse.json({ error: result.error }, { status })
  }
  return NextResponse.json({ ok: true, position: result.position }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const ok = await isAdminRequestAuthorized(req)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [listeners, stats] = await Promise.all([getAll(), getStats()])
  return NextResponse.json({ listeners, stats })
}
