import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/** Rechaza requests cross-origin en mutaciones públicas. */
export function isValidOrigin(req: NextRequest | Request): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin) return true
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function originForbidden(): NextResponse {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/** Campo honeypot oculto — bots suelen rellenarlo. */
export function isHoneypotClean(body: Record<string, unknown> | null | undefined): boolean {
  if (!body) return true
  const hp = body._hp ?? body.website ?? body.url
  return hp === undefined || hp === null || hp === ''
}

export function honeypotTriggered(): NextResponse {
  return NextResponse.json({ ok: true })
}

const MAX_BODY_BYTES = 8_192

export async function readJsonBody(
  req: NextRequest | Request,
): Promise<Record<string, unknown> | null> {
  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

export function guardPublicWrite(req: NextRequest): NextResponse | null {
  if (!isValidOrigin(req)) return originForbidden()
  return null
}
