/** Reglas de exclusividad plan Empresarial (app). */

export type AdExclusivityRow = {
  prioridad?: number
  planContratado?: string
  exclusivoApp?: boolean
  cliente?: string
  nombre?: string
}

export function isExclusiveCampaign(ad: AdExclusivityRow): boolean {
  return (
    ad.exclusivoApp === true ||
    (ad.planContratado === 'empresarial' && (ad.prioridad ?? 0) >= 10)
  )
}

export function clientKey(ad: AdExclusivityRow): string {
  return (ad.cliente || ad.nombre || '').trim().toLowerCase()
}

/** Cliente ganador de exclusividad global (solo una marca en toda la app). */
export function pickExclusiveClientKey(ads: AdExclusivityRow[]): string | null {
  const exclusive = ads.filter(isExclusiveCampaign)
  if (!exclusive.length) return null
  const best = [...exclusive].sort((a, b) => (b.prioridad ?? 0) - (a.prioridad ?? 0))[0]
  const key = clientKey(best)
  return key || null
}

export function filterAdsByExclusiveClient<T extends AdExclusivityRow>(
  ads: T[],
  exclusiveClientKey: string | null,
): T[] {
  if (!exclusiveClientKey) return ads
  return ads.filter(a => clientKey(a) === exclusiveClientKey)
}

/** Dentro de un tipo: si hay campaña exclusiva, solo la de mayor prioridad. */
export function applyTipoExclusivity<T extends AdExclusivityRow>(ads: T[]): T[] {
  if (!ads.length) return ads
  const exclusive = ads.filter(isExclusiveCampaign)
  if (!exclusive.length) return ads
  const best = [...exclusive].sort((a, b) => (b.prioridad ?? 0) - (a.prioridad ?? 0))[0]
  return best ? [best] : ads
}

export function resolveAdsForTipo<T extends AdExclusivityRow>(
  ads: T[],
  allActive: AdExclusivityRow[],
): T[] {
  const exclusiveKey = pickExclusiveClientKey(allActive)
  return applyTipoExclusivity(filterAdsByExclusiveClient(ads, exclusiveKey))
}
