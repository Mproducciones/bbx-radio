import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import {
  parsePublicidadPatch,
  parsePublicidadPayload,
  toSanityFields,
} from '@/lib/adminPublicidad'
import { sanityClient } from '@/lib/sanity'
import { getSanityWriteClient, isSanityWriteConfigured } from '@/lib/sanityWrite'

const ADS_QUERY = `*[_type == "publicidad"] | order(activo desc, prioridad desc, fechaFin asc) {
  _id, nombre, cliente, tipo, planContratado, duracionCampana, exclusivoApp, activo,
  fechaInicio, fechaFin, prioridad, tagline, cta, colorAccent, imagenUrl, enlace
}`

export async function GET(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ads = await sanityClient.fetch(ADS_QUERY)
  return NextResponse.json({ ads, writeEnabled: isSanityWriteConfigured() })
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = getSanityWriteClient()
  if (!client) {
    return NextResponse.json(
      { error: 'Falta SANITY_API_TOKEN en el servidor', code: 'sanity_write_disabled' },
      { status: 503 },
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = parsePublicidadPayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const doc = await client.create({
      _type: 'publicidad',
      ...toSanityFields(parsed.data),
    })
    return NextResponse.json({ ad: { _id: doc._id, ...parsed.data } }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al guardar en Sanity'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = getSanityWriteClient()
  if (!client) {
    return NextResponse.json(
      { error: 'Falta SANITY_API_TOKEN en el servidor', code: 'sanity_write_disabled' },
      { status: 503 },
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = parsePublicidadPatch(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    await client.patch(parsed.id).set(parsed.patch).commit()
    return NextResponse.json({ ok: true, id: parsed.id })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al actualizar en Sanity'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
