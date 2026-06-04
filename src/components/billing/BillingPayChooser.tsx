'use client'

import { useEffect, useState } from 'react'
import type { BillingCycle, BbxSubscriptionPlanId } from '@/lib/bbxSubscriptionPlans'

type PlanCheckout = {
  id: BbxSubscriptionPlanId
  nombre: string
  color: string
  popular: boolean
  monthly: { amountClp: number; label: string }
  annual: { amountClp: number; label: string; savingsLabel: string }
}

type PlansResponse = {
  plans: PlanCheckout[]
  providers: { mercadoPago: boolean; stripe: boolean }
  defaultPlan: BbxSubscriptionPlanId
}

export function BillingPayChooser({
  billingEmail,
  currentPlan,
  compact,
}: {
  billingEmail: string | null
  currentPlan?: string
  compact?: boolean
}) {
  const [data, setData] = useState<PlansResponse | null>(null)
  const [planId, setPlanId] = useState<BbxSubscriptionPlanId>('pro')
  const [cycle, setCycle] = useState<BillingCycle>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/billing/plans')
      .then(r => r.json())
      .then((d: PlansResponse) => {
        setData(d)
        const preferred =
          d.plans.find(p => p.id === currentPlan)?.id ??
          d.plans.find(p => p.id === d.defaultPlan)?.id ??
          'pro'
        setPlanId(preferred)
      })
      .catch(() => {})
  }, [currentPlan])

  const plan = data?.plans.find(p => p.id === planId)
  const price = plan ? (cycle === 'annual' ? plan.annual : plan.monthly) : null

  async function pay(provider?: 'mercadopago' | 'stripe') {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: billingEmail ?? undefined,
          plan: planId,
          cycle,
          provider: provider ?? (data?.providers.mercadoPago ? 'mercadopago' : undefined),
        }),
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
        return
      }
      setError(json.error ?? 'Pago en línea no disponible. Usa WhatsApp o transferencia.')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!data) {
    return (
      <p className="text-white/35 text-xs mt-4">Cargando opciones de pago…</p>
    )
  }

  return (
    <div className={`w-full max-w-sm ${compact ? 'mt-4' : 'mt-6'}`}>
      {!compact && data.plans.length > 1 && (
        <div className="flex gap-1.5 mb-3 p-1 rounded-full bg-white/5 border border-white/8">
          {data.plans.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanId(p.id)}
              className="flex-1 py-2 px-2 rounded-full text-[10px] font-bold transition-colors"
              style={{
                background: planId === p.id ? `${p.color}28` : 'transparent',
                color: planId === p.id ? p.color : 'rgba(255,255,255,0.5)',
                border: planId === p.id ? `1px solid ${p.color}50` : '1px solid transparent',
              }}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        {(['monthly', 'annual'] as const).map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setCycle(c)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors"
            style={{
              background: cycle === c ? 'rgba(219,137,24,0.15)' : 'rgba(255,255,255,0.04)',
              borderColor: cycle === c ? 'rgba(219,137,24,0.45)' : 'rgba(255,255,255,0.08)',
              color: cycle === c ? '#db8918' : 'rgba(255,255,255,0.55)',
            }}
          >
            {c === 'monthly' ? 'Mensual' : 'Anual'}
          </button>
        ))}
      </div>

      {price && (
        <p className="text-center text-white/70 text-sm mb-3">
          <span className="font-bold text-white">{price.label}</span>
          {cycle === 'annual' && plan && (
            <span className="block text-[10px] text-[#00D9A0] mt-0.5">{plan.annual.savingsLabel}</span>
          )}
        </p>
      )}

      {data.providers.mercadoPago ? (
        <button
          type="button"
          onClick={() => pay('mercadopago')}
          disabled={loading}
          className="w-full py-3 px-5 rounded-xl font-bold text-sm text-[#07070e] disabled:opacity-50 mb-2"
          style={{ background: 'linear-gradient(135deg, #00bcff, #009ee3)' }}
        >
          {loading ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => pay('mercadopago')}
          disabled={loading}
          className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white/90 disabled:opacity-50 mb-2"
          style={{ background: 'linear-gradient(135deg, #00bcff55, #009ee355)', border: '1px solid rgba(0,188,255,0.35)' }}
        >
          {loading ? '…' : 'Mercado Pago (próximamente)'}
        </button>
      )}

      {data.providers.stripe && (
        <button
          type="button"
          onClick={() => pay('stripe')}
          disabled={loading}
          className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #635bff, #7B2FFF)' }}
        >
          Pagar con tarjeta (Stripe)
        </button>
      )}

      {error && <p className="text-red-400/90 text-xs mt-2 text-center">{error}</p>}
      <p className="text-white/30 text-[10px] mt-2 text-center leading-snug">
        Transferencia o efectivo: confirma con BBX y reactivamos en minutos. Setup inicial se cobra aparte.
      </p>
    </div>
  )
}
