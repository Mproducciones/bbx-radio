'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminCard, AdminCardHeader, AdminIcons, AdminBadge } from '@/components/admin/adminUi'

interface BillingState {
  tenantId: string
  status: string
  plan: string
  currentPeriodEnd: string | null
  daysRemaining: number | null
  reason: string | null
  lastPaymentAt: string | null
  billingEmail: string | null
  stripeCustomerId: string | null
}

const STATUS_COLOR: Record<string, string> = {
  active: '#00D9A0',
  trial: '#00D4FF',
  grace: '#FFB300',
  suspended: '#FF3860',
}

export function BillingPanel() {
  const [sub, setSub] = useState<BillingState | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/billing', { credentials: 'include' })
      if (res.ok) setSub(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function action(name: string, extra?: Record<string, unknown>) {
    setActing(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/billing', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: name, ...extra }),
      })
      const data = await res.json()
      if (data.subscription) setSub(data.subscription)
      setMsg(res.ok ? 'Actualizado' : (data.error ?? 'Error'))
    } catch {
      setMsg('Error de conexión')
    } finally {
      setActing(false)
    }
  }

  async function openStripePortal() {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setMsg(data.error ?? 'Sin portal Stripe')
  }

  if (loading) {
    return (
      <AdminCard>
        <p className="text-white/40 text-sm p-4">Cargando suscripción…</p>
      </AdminCard>
    )
  }

  const color = STATUS_COLOR[sub?.status ?? 'active'] ?? '#888'

  return (
    <AdminCard>
      <AdminCardHeader
        title="Suscripción BBX"
        icon={<AdminIcons.chart />}
      />
      <p className="px-4 -mt-2 mb-2 text-white/40 text-xs">Corte automático si no hay pago · Manual o Stripe</p>

      <div className="px-4 pb-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <AdminBadge color={color}>{sub?.status?.toUpperCase() ?? '—'}</AdminBadge>
          <span className="text-white/40 text-xs">Tenant: {sub?.tenantId}</span>
          <span className="text-white/40 text-xs">Plan: {sub?.plan}</span>
        </div>

        {sub?.currentPeriodEnd && (
          <p className="text-white/60 text-sm">
            Vence: {new Date(sub.currentPeriodEnd).toLocaleDateString('es-CL')}
            {sub.daysRemaining != null && (
              <span className="text-white/40"> · {sub.daysRemaining} días</span>
            )}
          </p>
        )}
        {sub?.reason && (
          <p className="text-amber-400/90 text-xs">{sub.reason}</p>
        )}
        {sub?.lastPaymentAt && (
          <p className="text-white/35 text-xs">
            Último pago: {new Date(sub.lastPaymentAt).toLocaleString('es-CL')}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => action('mark_paid')}
            className="py-2.5 rounded-xl text-xs font-bold text-[#07070e] disabled:opacity-50"
            style={{ background: '#00D9A0' }}
          >
            ✓ Marcar pagado (+30 d)
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => action('set_grace')}
            className="py-2.5 rounded-xl text-xs font-bold text-[#07070e] disabled:opacity-50"
            style={{ background: '#FFB300' }}
          >
            Gracia manual
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => action('suspend', { notes: 'Suspendido desde panel' })}
            className="py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
            style={{ background: 'rgba(255,56,96,0.25)', border: '1px solid rgba(255,56,96,0.4)' }}
          >
            Suspender app
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => action('activate')}
            className="py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
            style={{ background: 'rgba(0,217,160,0.15)', border: '1px solid rgba(0,217,160,0.35)' }}
          >
            Reactivar
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => action('set_trial', { trialDays: 14 })}
            className="py-2.5 rounded-xl text-xs font-bold text-white/80 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            Trial 14 días
          </button>
          {sub?.stripeCustomerId && (
            <button
              type="button"
              onClick={openStripePortal}
              className="py-2.5 rounded-xl text-xs font-bold text-white/80"
              style={{ background: 'rgba(99,91,255,0.2)', border: '1px solid rgba(99,91,255,0.35)' }}
            >
              Portal Stripe
            </button>
          )}
        </div>

        {msg && <p className="text-white/50 text-xs">{msg}</p>}

        <p className="text-white/25 text-[10px] leading-relaxed border-t border-white/5 pt-3">
          Sin pago: gracia {process.env.NEXT_PUBLIC_SUBSCRIPTION_GRACE_DAYS ?? 7} días → app cae a /suspended.
          Override emergencia: SUBSCRIPTION_STATUS=suspended en Vercel.
        </p>
      </div>
    </AdminCard>
  )
}
