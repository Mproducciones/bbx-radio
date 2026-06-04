/**
 * Precios oficiales BBX (Capa 1 · radio → BBX).
 * Fuente única para facturación, /bbx, /suspended y futura API Mercado Pago.
 */

export type BbxSubscriptionPlanId = 'esencial' | 'pro' | 'premium'

export type BillingCycle = 'monthly' | 'annual'

export type BbxSubscriptionPlan = {
  id: BbxSubscriptionPlanId
  nombre: string
  color: string
  popular?: boolean
  /** CLP sin IVA (referencia Chile) */
  monthlyClp: number
  setupClp: number
  /** Meses que se cobran en plan anual (12 meses de servicio) */
  annualMonthsBilled: number
  tagline: string
}

/** 10 meses de precio = 12 meses de servicio (~17% descuento) */
export const ANNUAL_MONTHS_BILLED = 10

export const BBX_SUBSCRIPTION_PLANS: BbxSubscriptionPlan[] = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    color: '#40B9BF',
    monthlyClp: 80_000,
    setupClp: 100_000,
    annualMonthsBilled: ANNUAL_MONTHS_BILLED,
    tagline: 'PWA + engagement básico',
  },
  {
    id: 'pro',
    nombre: 'Pro',
    color: '#db8918',
    popular: true,
    monthlyClp: 120_000,
    setupClp: 150_000,
    annualMonthsBilled: ANNUAL_MONTHS_BILLED,
    tagline: 'Monetización digital (banners, sorteos, admin)',
  },
  {
    id: 'premium',
    nombre: 'Premium',
    color: '#7D59B5',
    monthlyClp: 160_000,
    setupClp: 200_000,
    annualMonthsBilled: ANNUAL_MONTHS_BILLED,
    tagline: 'Pro + dominio, APK y Play Store',
  },
]

export const BBX_BILLING_DEFAULT_PLAN: BbxSubscriptionPlanId = 'pro'

export const SUBSCRIPTION_PERIOD_DAYS: Record<BillingCycle, number> = {
  monthly: 30,
  annual: 365,
}

export function getSubscriptionPlan(id: string | null | undefined): BbxSubscriptionPlan | undefined {
  return BBX_SUBSCRIPTION_PLANS.find(p => p.id === id)
}

export function getSubscriptionPlanOrDefault(id: string | null | undefined): BbxSubscriptionPlan {
  return getSubscriptionPlan(id) ?? BBX_SUBSCRIPTION_PLANS.find(p => p.id === BBX_BILLING_DEFAULT_PLAN)!
}

export function formatClp(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`
  }
  return amount.toLocaleString('es-CL')
}

export function annualTotalClp(plan: BbxSubscriptionPlan): number {
  return plan.monthlyClp * plan.annualMonthsBilled
}

export function annualSavingsClp(plan: BbxSubscriptionPlan): number {
  return plan.monthlyClp * 12 - annualTotalClp(plan)
}

export function amountForPlan(planId: BbxSubscriptionPlanId, cycle: BillingCycle): number {
  const plan = getSubscriptionPlanOrDefault(planId)
  return cycle === 'annual' ? annualTotalClp(plan) : plan.monthlyClp
}

export function periodDaysForCycle(cycle: BillingCycle): number {
  return SUBSCRIPTION_PERIOD_DAYS[cycle]
}

/** Respuesta pública para UI de pago (sin secretos) */
export function plansForCheckout() {
  return BBX_SUBSCRIPTION_PLANS.map(p => ({
    id: p.id,
    nombre: p.nombre,
    color: p.color,
    popular: p.popular ?? false,
    monthly: {
      amountClp: p.monthlyClp,
      label: `$${formatClp(p.monthlyClp)}/mes`,
      periodDays: SUBSCRIPTION_PERIOD_DAYS.monthly,
    },
    annual: {
      amountClp: annualTotalClp(p),
      label: `$${formatClp(annualTotalClp(p))}/año`,
      savingsLabel: `Ahorras $${formatClp(annualSavingsClp(p))} (2 meses gratis)`,
      periodDays: SUBSCRIPTION_PERIOD_DAYS.annual,
    },
    setup: {
      amountClp: p.setupClp,
      label: `$${formatClp(p.setupClp)} setup único`,
      note: 'Se cobra una vez al activar la radio (no incluido en el link mensual/anual).',
    },
  }))
}

/** Notas de posicionamiento comercial (para docs y ventas) */
export const BBX_PRICING_ANALYSIS = {
  verdict: 'Los precios están en rango medio-alto justificado para el mercado radio regional chileno — no regalados, no fuera de mercado.',
  points: [
    'Esencial $80.000/mes: por debajo de un desarrollo a medida ($2–5M one-shot). Cubre hosting, soporte y PWA. Un solo banner vendido ($30–50k) paga gran parte del mes.',
    'Pro $120.000/mes: plan ancla recomendado. Con 2–3 slots de app llenos la radio triplica el retorno de la cuota BBX.',
    'Premium $160.000/mes: correcto como upgrade; el trabajo de Play Store + dominio justifica el salto sobre Pro.',
    'Setup $100–200k: evita clientes que no se comprometen; no es barrera si hay intención real.',
    'Anual (10× mensual): estándar SaaS B2B en Chile; mejora tu flujo de caja sin regalar demasiado.',
  ],
  risksIfLower: 'Más radios “problemáticas”, soporte 24/7 no rentable, percepción de producto barato.',
  risksIfHigher: 'Fricción vs. “solo Facebook” o web WordPress; necesitas demo y caso Bienvenida cerrado.',
} as const
