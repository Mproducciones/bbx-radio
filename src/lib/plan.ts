export type Plan = 'basico' | 'pro' | 'premium'

/**
 * Plan activo de esta instalación.
 * - Pro (oferta estándar): PWA, monetización, admin, sorteos, reportes.
 * - Premium (upgrade): todo Pro + dominio propio + APK en Play Store + lanzamientos.
 */
export const CURRENT_PLAN: Plan =
  (process.env.NEXT_PUBLIC_PLAN as Plan) || 'pro'

export const PLAN_LABELS: Record<Plan, string> = {
  basico: 'Esencial',
  pro: 'Pro',
  premium: 'Premium',
}

export const FEATURES = {
  noticias:     CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  eventos:      CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  replay:       CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  publicidad:   CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  contests:     CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  /** Solo plan Premium (upgrade con APK / tienda) */
  lanzamientos: CURRENT_PLAN === 'premium',
  /** Dominio propio y APK — entrega manual BBX al vender Premium */
  playStore:    CURRENT_PLAN === 'premium',
  customDomain: CURRENT_PLAN === 'premium',
}
