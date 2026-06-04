import { isShortCampaign } from '@/lib/adCampaignDuration'
import { isTipoAllowedForPlan, planLabel } from '@/lib/adPlanRules'
import type { SponsorPlanId } from '@/lib/sponsorPlans'

export type AdminAdRow = {
  _id: string
  nombre: string
  cliente?: string
  tipo: string
  planContratado?: SponsorPlanId
  exclusivoApp?: boolean
  activo: boolean
  fechaInicio: string
  fechaFin: string
  prioridad: number
  colorAccent?: string
}

function isExpired(fechaFin: string) {
  return new Date(fechaFin) < new Date()
}

function daysLeft(fechaFin: string) {
  return Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 86_400_000)
}

export type ClientAdGroup = {
  clientKey: string
  clientName: string
  campaigns: AdminAdRow[]
  activeCount: number
  expiringCount: number
  hasIssue: boolean
  dominantPlan?: SponsorPlanId
  sortRank: number
}

const PLAN_RANK: Record<SponsorPlanId, number> = {
  empresarial: 3,
  premium: 2,
  basico: 1,
}

function campaignStatus(ad: AdminAdRow): 'active' | 'expiring' | 'inactive' {
  if (!ad.activo || isExpired(ad.fechaFin)) return 'inactive'
  if (daysLeft(ad.fechaFin) <= 7) return 'expiring'
  return 'active'
}

/** Agrupa campañas por cliente y ordena: activos primero, luego A–Z. */
export function groupAdsByClient(ads: AdminAdRow[]): ClientAdGroup[] {
  const map = new Map<string, AdminAdRow[]>()

  for (const ad of ads) {
    const name = (ad.cliente || ad.nombre || 'Sin nombre').trim()
    const key = name.toLowerCase()
    const list = map.get(key) ?? []
    list.push(ad)
    map.set(key, list)
  }

  const groups: ClientAdGroup[] = []

  for (const [, campaigns] of map) {
    const sorted = [...campaigns].sort((a, b) => {
      const sa = campaignStatus(a)
      const sb = campaignStatus(b)
      const order = { active: 0, expiring: 1, inactive: 2 }
      if (order[sa] !== order[sb]) return order[sa] - order[sb]
      return new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime()
    })

    const clientName = sorted[0]?.cliente || sorted[0]?.nombre || 'Sin nombre'
    let activeCount = 0
    let expiringCount = 0
    let hasIssue = false
    let dominantPlan: SponsorPlanId | undefined
    let maxPlanRank = 0

    for (const ad of sorted) {
      const st = campaignStatus(ad)
      if (st === 'active') activeCount++
      if (st === 'expiring') expiringCount++
      if (ad.planContratado && !isTipoAllowedForPlan(ad.tipo, ad.planContratado)) hasIssue = true
      if (isShortCampaign(ad.fechaInicio, ad.fechaFin) && st !== 'inactive') hasIssue = true

      if (ad.planContratado && st !== 'inactive') {
        const r = PLAN_RANK[ad.planContratado]
        if (r > maxPlanRank) {
          maxPlanRank = r
          dominantPlan = ad.planContratado
        }
      }
    }

    const sortRank = activeCount > 0 ? (expiringCount > 0 ? 0 : 1) : 2

    groups.push({
      clientKey: clientName.toLowerCase(),
      clientName,
      campaigns: sorted,
      activeCount,
      expiringCount,
      hasIssue,
      dominantPlan,
      sortRank,
    })
  }

  return groups.sort((a, b) => {
    if (a.sortRank !== b.sortRank) return a.sortRank - b.sortRank
    if (a.expiringCount !== b.expiringCount) return b.expiringCount - a.expiringCount
    return a.clientName.localeCompare(b.clientName, 'es', { sensitivity: 'base' })
  })
}

export function filterClientGroups(
  groups: ClientAdGroup[],
  filter: 'todos' | 'activos' | 'vencer' | 'vencidos' | 'alertas',
): ClientAdGroup[] {
  if (filter === 'todos') return groups

  return groups
    .map(g => {
      const campaigns = g.campaigns.filter(ad => {
        const st = campaignStatus(ad)
        if (filter === 'activos') return st === 'active' || st === 'expiring'
        if (filter === 'vencer') return st === 'expiring'
        if (filter === 'vencidos') return st === 'inactive'
        if (filter === 'alertas') {
          const planMismatch = ad.planContratado && !isTipoAllowedForPlan(ad.tipo, ad.planContratado)
          const corta = isShortCampaign(ad.fechaInicio, ad.fechaFin) && st !== 'inactive'
          return planMismatch || corta
        }
        return true
      })
      return { ...g, campaigns }
    })
    .filter(g => g.campaigns.length > 0)
}

export { campaignStatus, daysLeft, isExpired }
