import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { getDemoAds } from '@/lib/demoCampaigns'
import { sanitizeAdLink } from '@/lib/safeUrl'

const ALLOWED_TIPOS = ['banner_superior', 'banner_intermedio', 'banner_inferior', 'banner_premium']

function sanitizeAds<T extends { enlace?: string }>(ads: T[]): T[] {
  return ads.map(ad => ({
    ...ad,
    enlace: sanitizeAdLink(ad.enlace),
  }))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')

  if (!tipo || !ALLOWED_TIPOS.includes(tipo)) {
    return NextResponse.json({ error: 'Invalid tipo parameter' }, { status: 400 })
  }

  try {
    const now = new Date().toISOString()

    const ads = await sanityClient.fetch(
      `*[_type == "publicidad" && activo == true && tipo == $tipo
        && fechaInicio <= $now && fechaFin >= $now
      ] | order(prioridad desc) {
        _id, nombre, tipo, imagen, imagenUrl, enlace, activo, prioridad,
        tagline, cta, colorAccent, cliente
      }`,
      { tipo, now },
    )

    if (Array.isArray(ads) && ads.length > 0) {
      return NextResponse.json(sanitizeAds(ads))
    }

    return NextResponse.json(sanitizeAds(getDemoAds(tipo)))
  } catch {
    return NextResponse.json(sanitizeAds(getDemoAds(tipo)))
  }
}
