import { NextResponse, type NextRequest } from 'next/server'
import { addSaludo, getSaludos } from '@/lib/saludoStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const body = await req.json().catch(() => null)

  if (!body?.para || !body?.de || !body?.motivo) {
    return NextResponse.json({ error: 'para, de y motivo son requeridos' }, { status: 400 })
  }

  const result = await addSaludo(body, ip)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 429 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const ok = await isAdminRequestAuthorized(req)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getSaludos())
}
