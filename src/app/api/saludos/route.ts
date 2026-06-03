import { NextResponse, type NextRequest } from 'next/server'
import { addSaludo, getSaludos, type MotivoId } from '@/lib/saludoStore'
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
  if (!body?.para || !body?.de || !body?.motivo) {
    return NextResponse.json({ error: 'para, de y motivo son requeridos' }, { status: 400 })
  }

  const result = await addSaludo({
    para: String(body.para),
    de: String(body.de),
    motivo: String(body.motivo) as MotivoId,
    mensaje: body.mensaje ? String(body.mensaje) : undefined,
    cancion: body.cancion ? String(body.cancion) : undefined,
    artista: body.artista ? String(body.artista) : undefined,
  }, ip)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 429 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const ok = await isAdminRequestAuthorized(req)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getSaludos())
}
