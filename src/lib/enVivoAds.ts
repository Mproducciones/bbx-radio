import { getDemoAds, type DemoAd } from '@/lib/demoCampaigns'
import { demoAdsForSponsorTier, readSponsorDemoTier, type SponsorAdTierId } from '@/lib/sponsorAdTiers'
import { isExclusiveCampaign } from '@/lib/adExclusivity'

export type EnVivoSlotMode = 'standard' | 'highlighted'

export type EnVivoAdsLoad = {
  ads: DemoAd[]
  slotMode: EnVivoSlotMode
}

/** Qué slot En Vivo corresponde a cada plan (alineado a adPlanRules). */
export function enVivoConfigForTier(tier: SponsorAdTierId | null): {
  tipo: 'banner_inferior' | 'banner_premium'
  slotMode: EnVivoSlotMode
} {
  if (tier === 'basico') {
    return { tipo: 'banner_inferior', slotMode: 'standard' }
  }
  if (tier === 'premium' || tier === 'empresarial') {
    return { tipo: 'banner_premium', slotMode: 'highlighted' }
  }
  return { tipo: 'banner_premium', slotMode: 'highlighted' }
}

function demoPool(tier: SponsorAdTierId | null): Record<string, DemoAd[]> {
  return tier ? demoAdsForSponsorTier(tier) : {}
}

/** Carga coherente con el plan demo activo (cliente) o producción. */
export function loadEnVivoAdsClient(): EnVivoAdsLoad {
  const tier = readSponsorDemoTier()
  const { tipo, slotMode } = enVivoConfigForTier(tier)
  const overrides = demoPool(tier)

  let ads = getDemoAds(tipo, overrides).filter(a => a.imagenUrl)

  if (tier === 'basico') {
    return { ads, slotMode: 'standard' }
  }

  if (tier === 'premium' || tier === 'empresarial') {
    if (ads.length === 0) {
      ads = getDemoAds('banner_premium', overrides).filter(a => a.imagenUrl)
    }
    return { ads, slotMode: 'highlighted' }
  }

  /* Sin demo de plan: premium gana; si no hay, inferior estándar */
  const premium = getDemoAds('banner_premium', overrides).filter(a => a.imagenUrl)
  if (premium.length > 0) {
    return { ads: premium, slotMode: 'highlighted' }
  }
  const inferior = getDemoAds('banner_inferior', overrides).filter(a => a.imagenUrl)
  return { ads: inferior, slotMode: 'standard' }
}

export function mapApiAdRow(row: {
  _id: string
  nombre: string
  cliente?: string
  tipo: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
  imagen?: unknown
  enlace?: string
  planContratado?: string
  exclusivoApp?: boolean
  prioridad?: number
}): DemoAd & { imagen?: unknown } {
  return {
    _id: row._id,
    nombre: row.nombre,
    cliente: row.cliente ?? row.nombre,
    tipo: row.tipo,
    tagline: row.tagline,
    cta: row.cta,
    colorAccent: row.colorAccent,
    imagenUrl: row.imagenUrl,
    enlace: row.enlace,
    activo: true,
    prioridad: row.prioridad ?? 1,
    planContratado: row.planContratado,
    exclusivoApp: row.exclusivoApp,
    imagen: row.imagen,
  }
}

export function pickEnVivoFromApiRows(
  premium: Parameters<typeof mapApiAdRow>[0][],
  inferior: Parameters<typeof mapApiAdRow>[0][],
  tier: SponsorAdTierId | null,
): EnVivoAdsLoad {
  const { tipo, slotMode } = enVivoConfigForTier(tier)

  if (tipo === 'banner_inferior') {
    const ads = inferior
      .filter(a => a.imagenUrl || a.imagen)
      .map(mapApiAdRow)
    return { ads, slotMode: 'standard' }
  }

  const ads = premium
    .filter(a => a.imagenUrl || a.imagen)
    .map(mapApiAdRow)

  if (ads.length > 0) {
    return { ads, slotMode: 'highlighted' }
  }

  const fallback = inferior
    .filter(a => a.imagenUrl || a.imagen)
    .map(mapApiAdRow)
  return { ads: fallback, slotMode: 'standard' }
}

export function enVivoNoRotation(ads: { exclusivoApp?: boolean; planContratado?: string; prioridad?: number }[]): boolean {
  return ads.length <= 1 || ads.some(a => isExclusiveCampaign(a))
}
