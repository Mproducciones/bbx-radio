'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield } from 'lucide-react'
import { AdminCard, AdminCardHeader, AdminIcons, AdminBadge } from '@/components/admin/adminUi'
import { BillingTemplatesPanel } from '@/components/admin/BillingTemplatesPanel'
import type { BbxSubscriptionPlanId } from '@/lib/bbxSubscriptionPlans'

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

function ActionBtn({
  label,
  onClick,
  disabled,
  variant = 'solid',
  accent,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'solid' | 'outline' | 'ghost'
  accent: string
}) {
  const styles =
    variant === 'solid'
      ? { background: accent, color: '#07070e', border: 'none' }
      : variant === 'outline'
        ? { background: `${accent}18`, color: '#fff', border: `1px solid ${accent}45` }
        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full min-w-0 rounded-xl px-3 py-2.5 text-[11px] font-bold leading-tight disabled:opacity-50 transition-transform active:scale-[0.98]"
      style={styles}
    >
      {label}
    </button>
  )
}

export function BillingPanel() {
  const [tenants, setTenants] = useState<BillingState[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/billing', { credentials: 'include' })
      if (res.status === 403) {
        setForbidden(true)
        return
      }
      if (res.ok) {
        const data = await res.json()
        const list: BillingState[] = data.tenants ?? []
        setTenants(list)
        setSelectedId(prev => prev ?? data.currentTenantId ?? list[0]?.tenantId ?? null)
      }
    } catch {
      setMsg('No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const sub = tenants.find(t => t.tenantId === selectedId) ?? null

  async function action(name: string, extra?: Record<string, unknown>) {
    if (!selectedId) return
    setActing(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/billing', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: name, tenantId: selectedId, ...extra }),
      })
      const data = await res.json()
      if (data.tenants) setTenants(data.tenants)
      if (data.subscription) {
        setTenants(prev =>
          prev.map(t => (t.tenantId === data.subscription.tenantId ? data.subscription : t)),
        )
      }
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
      <AdminCard accent="#00D9A0">
        <p className="text-white/40 text-sm p-4">Cargando suscripciones…</p>
      </AdminCard>
    )
  }

  if (forbidden) {
    return (
      <AdminCard>
        <p className="text-white/50 text-sm p-4">Esta sección es solo para el super admin de BBX.</p>
      </AdminCard>
    )
  }

  const color = STATUS_COLOR[sub?.status ?? 'active'] ?? '#888'

  return (
    <AdminCard accent="#00D9A0">
      <AdminCardHeader
        title="Suscripciones BBX"
        icon={<AdminIcons.chart />}
        badges={
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,217,160,0.12)', color: '#00D9A0', border: '1px solid rgba(0,217,160,0.28)' }}
          >
            <Shield className="w-3 h-3" aria-hidden />
            Super admin
          </span>
        }
      />
      <p className="px-4 -mt-2 mb-3 text-white/40 text-xs leading-relaxed">
        Control de pagos de todas las radios · corte automático si no pagan · manual o Stripe
      </p>

      {tenants.length > 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {tenants.map(t => {
            const active = t.tenantId === selectedId
            const c = STATUS_COLOR[t.status] ?? '#888'
            return (
              <button
                key={t.tenantId}
                type="button"
                onClick={() => setSelectedId(t.tenantId)}
                className="rounded-xl px-3 py-2 text-left min-w-0 max-w-full transition-colors"
                style={{
                  background: active ? `${c}18` : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${c}50` : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-[11px] font-bold text-white truncate">{t.tenantId}</p>
                <p className="text-[9px] uppercase font-bold mt-0.5" style={{ color: c }}>
                  {t.status}
                </p>
              </button>
            )
          })}
        </div>
      )}

      {sub && (
        <div className="px-4 pb-4 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <AdminBadge color={color}>{sub.status.toUpperCase()}</AdminBadge>
            <span className="text-white/50 text-xs font-medium truncate">Radio: {sub.tenantId}</span>
            <span className="text-white/35 text-xs">Plan {sub.plan}</span>
          </div>

          {sub.currentPeriodEnd && (
            <p className="text-white/60 text-sm">
              Vence: {new Date(sub.currentPeriodEnd).toLocaleDateString('es-CL')}
              {sub.daysRemaining != null && (
                <span className="text-white/40"> · {sub.daysRemaining} días</span>
              )}
            </p>
          )}
          {sub.reason && <p className="text-amber-400/90 text-xs">{sub.reason}</p>}
          {sub.lastPaymentAt && (
            <p className="text-white/35 text-xs">
              Último pago: {new Date(sub.lastPaymentAt).toLocaleString('es-CL')}
            </p>
          )}
          {sub.billingEmail && (
            <p className="text-white/35 text-xs truncate">Facturación: {sub.billingEmail}</p>
          )}

          <div className="grid grid-cols-2 gap-2 max-w-md">
            <ActionBtn
              label="✓ Pagado mes (+30 d)"
              accent="#00D9A0"
              disabled={acting}
              onClick={() =>
                action('mark_paid', {
                  plan: sub.plan as BbxSubscriptionPlanId,
                  billingCycle: 'monthly',
                })
              }
            />
            <ActionBtn
              label="✓ Pagado año (+365 d)"
              accent="#40B9BF"
              disabled={acting}
              onClick={() =>
                action('mark_paid', {
                  plan: sub.plan as BbxSubscriptionPlanId,
                  billingCycle: 'annual',
                })
              }
            />
            <ActionBtn
              label="Gracia manual"
              accent="#FFB300"
              disabled={acting}
              onClick={() => action('set_grace')}
            />
            <ActionBtn
              label="Suspender app"
              variant="outline"
              accent="#FF3860"
              disabled={acting}
              onClick={() => action('suspend', { notes: 'Suspendido desde panel BBX' })}
            />
            <ActionBtn
              label="Reactivar"
              variant="outline"
              accent="#00D9A0"
              disabled={acting}
              onClick={() => action('activate')}
            />
            <ActionBtn
              label="Trial 14 días"
              variant="ghost"
              accent="#00D4FF"
              disabled={acting}
              onClick={() => action('set_trial', { trialDays: 14 })}
            />
            {sub.stripeCustomerId && (
              <ActionBtn
                label="Portal Stripe"
                variant="ghost"
                accent="#635bff"
                disabled={acting}
                onClick={openStripePortal}
              />
            )}
          </div>

          {msg && <p className="text-white/50 text-xs">{msg}</p>}

          <p className="text-white/25 text-[10px] leading-relaxed border-t border-white/5 pt-3">
            Sin pago: gracia {process.env.NEXT_PUBLIC_SUBSCRIPTION_GRACE_DAYS ?? 7} días → la radio cae a /suspended.
            Override emergencia: SUBSCRIPTION_STATUS=suspended en Vercel del deploy.
          </p>
        </div>
      )}

      {sub && (
        <div className="px-4 pb-4">
          <BillingTemplatesPanel
            tenantId={sub.tenantId}
            plan={sub.plan}
            periodEnd={sub.currentPeriodEnd}
          />
        </div>
      )}
    </AdminCard>
  )
}
