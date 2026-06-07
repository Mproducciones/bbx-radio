import type { SponsorPlanId } from '@/lib/sponsorPlans'
import { SPONSOR_PLANS, getSponsorPlan } from '@/lib/sponsorPlans'
import type { DemoAd } from '@/lib/demoCampaigns'
import { RADIO_AD, floatingProgramLine, programPatrocinioLabel } from '@/lib/radioAdBranding'
import { enVivoAdSalesLine } from '@/lib/enVivoAdSchedule'

export type SponsorAdTierId = SponsorPlanId

export type BannerVariant = 'standard' | 'hero' | 'exclusive'

export type SponsorTierPreview = {
  id: SponsorAdTierId
  nombre: string
  precio: string
  color: string
  tagline: string
  bannerVariant: BannerVariant
  cliente: string
  brandInitial: string
  taglineAd: string
  cta: string
  imagenUrl: string
  showFloatingPremium: boolean
  floatingTagline: string
  showRotationBadge: boolean
  programBadge?: string
  slotsLabel: string
  incluyeHighlight: string[]
}

const WA = 'https://wa.me/56950291592'

const EMPRESARIAL_BRAND = {
  cliente: 'Hotel Casino Plaza',
  initial: 'H',
  tagline: `Patrocinador oficial del ${RADIO_AD.featuredProgramName} · Semana exclusiva en ${RADIO_AD.frequency}`,
  cta: 'Reservar',
  imagenUrl: '/ads/empresarial-exclusive.svg',
  color: '#7D59B5',
}

export const SPONSOR_TIER_PREVIEWS: Record<SponsorAdTierId, SponsorTierPreview> = {
  basico: {
    id: 'basico',
    nombre: 'Básico',
    precio: '80.000',
    color: '#40B9BF',
    tagline: 'Banner rotativo + 4 spots FM',
    bannerVariant: 'standard',
    cliente: 'Pizza Italiana',
    brandInitial: 'P',
    taglineAd: `Delivery en 30 min · ${RADIO_AD.city}`,
    cta: 'Pedir',
    imagenUrl: '/ads/pizza-intermedio.svg',
    showFloatingPremium: false,
    floatingTagline: '',
    showRotationBadge: true,
    slotsLabel: enVivoAdSalesLine('standard'),
    incluyeHighlight: ['4 spots / día', 'Banner rotativo en app'],
  },
  premium: {
    id: 'premium',
    nombre: 'Premium',
    precio: '150.000',
    color: '#db8918',
    tagline: 'Banner destacado + horario peak',
    bannerVariant: 'hero',
    cliente: 'Supermercado El Ahorro',
    brandInitial: 'S',
    taglineAd: '2×1 esta semana · Destacado por intervalos',
    cta: 'Ver oferta',
    imagenUrl: '/ads/ahorro-premium.svg',
    showFloatingPremium: true,
    floatingTagline: `Las mejores ofertas en ${RADIO_AD.city} · ${RADIO_AD.frequency}`,
    showRotationBadge: false,
    slotsLabel: enVivoAdSalesLine('highlighted'),
    incluyeHighlight: ['8 spots peak', 'Banner premium flotante'],
  },
  empresarial: {
    id: 'empresarial',
    nombre: 'Empresarial',
    precio: '250.000',
    color: EMPRESARIAL_BRAND.color,
    tagline: 'Patrocinio de programa + exclusividad',
    bannerVariant: 'exclusive',
    cliente: EMPRESARIAL_BRAND.cliente,
    brandInitial: EMPRESARIAL_BRAND.initial,
    taglineAd: EMPRESARIAL_BRAND.tagline,
    cta: EMPRESARIAL_BRAND.cta,
    imagenUrl: EMPRESARIAL_BRAND.imagenUrl,
    showFloatingPremium: true,
    floatingTagline: floatingProgramLine(),
    showRotationBadge: false,
    programBadge: programPatrocinioLabel('tu marca'),
    slotsLabel: `${enVivoAdSalesLine('exclusive')} · sin competencia en otros banners`,
    incluyeHighlight: ['12 spots / día', 'Badge en grilla', 'Sin competencia en app'],
  },
}

export const SPONSOR_TIER_ORDER: SponsorAdTierId[] = ['basico', 'premium', 'empresarial']

export function getTierPreview(id: SponsorAdTierId): SponsorTierPreview {
  return SPONSOR_TIER_PREVIEWS[id]
}

export function tierPlanMeta(id: SponsorAdTierId) {
  return getSponsorPlan(id) ?? SPONSOR_PLANS[0]
}

/** Campañas demo alineadas al plan contratado (para app en vivo). */
export function demoAdsForSponsorTier(tier: SponsorAdTierId): Record<string, DemoAd[]> {
  const p = getTierPreview(tier)
  const brand = (tipo: string, prioridad = 10, opts: Partial<DemoAd> = {}): DemoAd => ({
    _id: `demo-tier-${tier}-${tipo}`,
    nombre: p.cliente,
    cliente: p.cliente,
    tipo,
    tagline: p.taglineAd,
    cta: p.cta,
    colorAccent: p.color,
    imagenUrl: p.imagenUrl,
    enlace: WA,
    activo: true,
    prioridad,
    ...opts,
  })

  if (tier === 'empresarial') {
    const exclusiveMeta = { planContratado: 'empresarial' as const, exclusivoApp: true }
    const only = brand('banner_premium', 12, exclusiveMeta)
    return {
      banner_premium: [only],
      banner_superior: [{ ...only, tipo: 'banner_superior', _id: 'demo-tier-emp-superior', ...exclusiveMeta }],
      banner_intermedio: [{ ...only, tipo: 'banner_intermedio', _id: 'demo-tier-emp-mid', ...exclusiveMeta }],
      banner_inferior: [{ ...only, tipo: 'banner_inferior', _id: 'demo-tier-emp-inf', ...exclusiveMeta }],
    }
  }

  if (tier === 'premium') {
    return {
      banner_premium: [brand('banner_premium')],
      banner_superior: [
        {
          _id: 'demo-tier-prem-superior',
          nombre: 'AutoMundo Rancagua',
          cliente: 'AutoMundo Rancagua',
          tipo: 'banner_superior',
          tagline: `Tu próximo auto en ${RADIO_AD.city}`,
          cta: 'Ver catálogo',
          colorAccent: '#40B9BF',
          imagenUrl: '/ads/automundo-superior.svg',
          enlace: WA,
          activo: true,
          prioridad: 2,
        },
      ],
      banner_intermedio: [brand('banner_intermedio')],
      banner_inferior: [brand('banner_inferior', 8)],
    }
  }

  return {}
}

export const SPONSOR_DEMO_TIER_STORAGE = 'pulso_sponsor_demo_tier'
export const SPONSOR_DEMO_CHANGE_EVENT = 'bbx-sponsor-demo-change'

function notifySponsorDemoChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SPONSOR_DEMO_CHANGE_EVENT))
  }
}

export function persistSponsorDemoTier(tier: SponsorAdTierId) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SPONSOR_DEMO_TIER_STORAGE, tier)
  notifySponsorDemoChange()
}

export function readSponsorDemoTier(): SponsorAdTierId | null {
  if (typeof window === 'undefined') return null
  const v = sessionStorage.getItem(SPONSOR_DEMO_TIER_STORAGE)
  if (v === 'basico' || v === 'premium' || v === 'empresarial') return v
  return null
}

export function clearSponsorDemoTier() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SPONSOR_DEMO_TIER_STORAGE)
  notifySponsorDemoChange()
}

export function appPathForTierDemo(): string {
  return '/participa'
}
