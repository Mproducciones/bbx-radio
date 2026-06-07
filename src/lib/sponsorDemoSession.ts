import {
  persistSponsorDemoTier,
  type SponsorAdTierId,
} from '@/lib/sponsorAdTiers'

/** Activa preview comercial del plan (cookie + sessionStorage, 1 h). */
export function activateSponsorDemoTier(tier: SponsorAdTierId) {
  persistSponsorDemoTier(tier)
  if (typeof document !== 'undefined') {
    document.cookie = `pulso_sponsor_demo_tier=${tier};path=/;max-age=3600;SameSite=Lax`
  }
}
