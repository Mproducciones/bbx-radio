import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sanityClient } from '@/lib/sanity'
import { getDemoAds, shouldUseDemoAds, DEMO_ADS_BY_TIPO, type DemoAd } from '@/lib/demoCampaigns'
import { demoAdsForSponsorTier, type SponsorAdTierId } from '@/lib/sponsorAdTiers'
import { sanitizeAdLink } from '@/lib/safeUrl'
import { resolveAdsForTipo, type AdExclusivityRow } from '@/lib/adExclusivity'

const TIER_COOKIE = 'pulso_sponsor_demo_tier'

function tierFromCookie(value: string | undefined): SponsorAdTierId | null {
  if (value === 'basico' || value === 'premium' || value === 'empresarial') return value
  return null
}

const ALLOWED_TIPOS = ['banner_superior', 'banner_intermedio', 'banner_inferior', 'banner_premium']

function sanitizeAds<T extends { enlace?: string }>(ads: T[]): T[] {
  return ads.map(ad => ({
    ...ad,
    enlace: sanitizeAdLink(ad.enlace),
  }))
}

function flattenDemoPool(pool: Record<string, DemoAd[]>): AdExclusivityRow[] {
  return Object.values(pool).flat()
}

async function fetchAllActiveMeta(): Promise<AdExclusivityRow[]> {
  const now = new Date().toISOString()
  return sanityClient.fetch(
    `*[_type == "publicidad" && activo == true && fechaInicio <= $now && fechaFin >= $now]{
      cliente, nombre, prioridad, planContratado, exclusivoApp
    }`,
    { now },
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')

  if (!tipo || !ALLOWED_TIPOS.includes(tipo)) {
    return NextResponse.json({ error: 'Invalid tipo parameter' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const tier = tierFromCookie(cookieStore.get(TIER_COOKIE)?.value)

  if (tier) {
    const pool = flattenDemoPool(demoAdsForSponsorTier(tier))
    const ads = getDemoAds(tipo, demoAdsForSponsorTier(tier))
    return NextResponse.json(sanitizeAds(resolveAdsForTipo(ads, pool)))
  }

  if (shouldUseDemoAds()) {
    const pool = flattenDemoPool(DEMO_ADS_BY_TIPO)
    return NextResponse.json(sanitizeAds(resolveAdsForTipo(getDemoAds(tipo), pool)))
  }

  try {
    const now = new Date().toISOString()
    const [ads, pool] = await Promise.all([
      sanityClient.fetch(
        `*[_type == "publicidad" && activo == true && tipo == $tipo
          && fechaInicio <= $now && fechaFin >= $now
        ] | order(prioridad desc) {
          _id, nombre, tipo, imagen, imagenUrl, enlace, activo, prioridad,
          tagline, cta, colorAccent, cliente, planContratado, exclusivoApp
        }`,
        { tipo, now },
      ),
      fetchAllActiveMeta(),
    ])

    if (Array.isArray(ads) && ads.length > 0) {
      const withVisual = ads.filter(a => a.imagenUrl || a.imagen)
      if (withVisual.length > 0) {
        return NextResponse.json(sanitizeAds(resolveAdsForTipo(withVisual, pool ?? [])))
      }
    }

    const poolFallback = flattenDemoPool(DEMO_ADS_BY_TIPO)
    return NextResponse.json(sanitizeAds(resolveAdsForTipo(getDemoAds(tipo), poolFallback)))
  } catch {
    const poolFallback = flattenDemoPool(DEMO_ADS_BY_TIPO)
    return NextResponse.json(sanitizeAds(resolveAdsForTipo(getDemoAds(tipo), poolFallback)))
  }
}
