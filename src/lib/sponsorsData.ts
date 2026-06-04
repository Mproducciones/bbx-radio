import { cookies } from 'next/headers'
import { sanityClient } from '@/lib/sanity'
import { DEMO_SPONSORS, shouldUseDemoAds } from '@/lib/demoCampaigns'
import { getTierPreview, type SponsorAdTierId } from '@/lib/sponsorAdTiers'
import { isExclusiveCampaign, pickExclusiveClientKey, clientKey } from '@/lib/adExclusivity'
import { sanitizeAdLink } from '@/lib/safeUrl'
import type { SponsorPlanId } from '@/lib/sponsorPlans'

function tierSponsorsFromCookie(tier: SponsorAdTierId): Sponsor[] {
  const p = getTierPreview(tier)
  return [
    {
      id: `demo-tier-${tier}`,
      name: p.cliente,
      cliente: p.cliente,
      tagline: p.taglineAd,
      imagenUrl: p.imagenUrl,
      enlace: sanitizeAdLink('https://wa.me/56950291592'),
      colorAccent: p.color,
      tipos: ['banner_premium', 'banner_superior', 'banner_intermedio', 'banner_inferior'],
      planContratado: tier,
      destacado: tier === 'empresarial',
    },
  ]
}

export type Sponsor = {
  id: string
  name: string
  cliente: string
  tagline?: string
  imagenUrl?: string
  enlace?: string
  colorAccent?: string
  tipos: string[]
  planContratado?: SponsorPlanId
  /** Plan Empresarial exclusivo — primer lugar en /patrocinadores */
  destacado?: boolean
}

function sortSponsors(list: Sponsor[]): Sponsor[] {
  return [...list].sort((a, b) => {
    if (a.destacado && !b.destacado) return -1
    if (!a.destacado && b.destacado) return 1
    return a.cliente.localeCompare(b.cliente, 'es')
  })
}

export async function getSponsors(): Promise<Sponsor[]> {
  const cookieStore = await cookies()
  const tierRaw = cookieStore.get('pulso_sponsor_demo_tier')?.value
  const tier =
    tierRaw === 'basico' || tierRaw === 'premium' || tierRaw === 'empresarial' ? tierRaw : null
  if (tier) return tierSponsorsFromCookie(tier)

  try {
    const now = new Date().toISOString()
    const ads = await sanityClient.fetch(
      `*[_type == "publicidad" && activo == true && fechaInicio <= $now && fechaFin >= $now]
        | order(prioridad desc) {
          _id, nombre, cliente, tipo, tagline, imagenUrl, enlace, colorAccent,
          planContratado, exclusivoApp, prioridad
        }`,
      { now },
    )

    const exclusiveKey = pickExclusiveClientKey(ads ?? [])
    const byClient = new Map<string, Sponsor>()

    for (const ad of ads ?? []) {
      const key = ad.cliente || ad.nombre
      const plan = ad.planContratado as SponsorPlanId | undefined
      const isDestacado =
        exclusiveKey !== null && clientKey(ad) === exclusiveKey && isExclusiveCampaign(ad)

      const existing = byClient.get(key)
      if (existing) {
        existing.tipos.push(ad.tipo)
        if (isDestacado) existing.destacado = true
        if (plan === 'empresarial') existing.planContratado = 'empresarial'
      } else {
        byClient.set(key, {
          id: ad._id,
          name: ad.nombre,
          cliente: key,
          tagline: ad.tagline,
          imagenUrl: ad.imagenUrl,
          enlace: sanitizeAdLink(ad.enlace),
          colorAccent: ad.colorAccent,
          tipos: [ad.tipo],
          planContratado: plan,
          destacado: isDestacado,
        })
      }
    }

    const live = sortSponsors([...byClient.values()])
    if (shouldUseDemoAds() || live.length === 0) return DEMO_SPONSORS
    return live
  } catch {
    return DEMO_SPONSORS
  }
}
