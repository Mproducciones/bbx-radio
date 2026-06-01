import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { sanityClient } from '@/lib/sanity'

export async function GET(req: NextRequest) {
  if (!await isAdminRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ads = await sanityClient.fetch(
    `*[_type == "publicidad"] | order(activo desc, prioridad desc, fechaFin asc) {
      _id, nombre, cliente, tipo, activo, fechaInicio, fechaFin, prioridad, tagline, cta, colorAccent
    }`
  )

  return NextResponse.json(ads)
}
