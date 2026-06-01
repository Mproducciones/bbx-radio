import { NextResponse, type NextRequest } from 'next/server'
import { updateStatus } from '@/lib/songRequestStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

const VALID_STATUSES = ['approved', 'played', 'rejected', 'pending'] as const

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAdminRequestAuthorized(req)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'status inválido' }, { status: 400 })
  }

  const ok = updateStatus(id, body.status)
  if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
