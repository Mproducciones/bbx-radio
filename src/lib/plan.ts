export type Plan = 'basico' | 'pro' | 'premium'

/** Bienvenida demo usa premium para mostrar todo el producto vendido. */
export const CURRENT_PLAN: Plan =
  (process.env.NEXT_PUBLIC_PLAN as Plan) ||
  (process.env.NEXT_PUBLIC_RADIO_ID === 'bienvenida-933' ? 'premium' : 'pro')

export const FEATURES = {
  noticias:     CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  eventos:      CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  replay:       CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  publicidad:   CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  contests:     CURRENT_PLAN === 'pro' || CURRENT_PLAN === 'premium',
  lanzamientos: CURRENT_PLAN === 'premium',
}
