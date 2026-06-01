import { NextResponse, type NextRequest } from 'next/server'
import { updateSaludoStatus } from '@/lib/saludoStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ok = await isAdminRequestAuthorized(req)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json().catch(() => ({}))
  if (!['pending', 'al_aire', 'leido'].includes(status)) {
    return NextResponse.json({ error: 'status inválido' }, { status: 400 })
  }

  const updated = await updateSaludoStatus(id, status)
  return NextResponse.json({ ok: updated })
}
