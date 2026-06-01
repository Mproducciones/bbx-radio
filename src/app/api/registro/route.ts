import { NextResponse, type NextRequest } from 'next/server'
import { register, getAll, getStats } from '@/lib/registryStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const body = await req.json().catch(() => null)

  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: 'name y phone requeridos' }, { status: 400 })
  }

  const result = register(
    { name: body.name, phone: body.phone, contest: body.contest ?? 'general' },
    ip,
  )

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ ok: true, position: result.position }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const ok = await isAdminRequestAuthorized(req)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ listeners: getAll(), stats: getStats() })
}
