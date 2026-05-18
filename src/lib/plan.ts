export type Plan = 'basico' | 'pro' | 'premium'

export const CURRENT_PLAN: Plan = (process.env.NEXT_PUBLIC_PLAN as Plan) || 'pro'

export const FEATURES = {
  noticias:     CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  eventos:      CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  replay:       CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  publicidad:   CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  lanzamientos: CURRENT_PLAN === 'premium',
}
