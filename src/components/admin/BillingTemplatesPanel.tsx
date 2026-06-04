'use client'

import { useMemo, useState } from 'react'
import { RADIO } from '@/lib/radioConfig'
import {
  renderBillingTemplate,
  TEMPLATE_CATALOG,
  templateQuickVars,
  whatsappUrlForTemplate,
  type TemplateId,
} from '@/lib/bbxBillingTemplates'
import type { BbxSubscriptionPlanId, BillingCycle } from '@/lib/bbxSubscriptionPlans'
import { AdminCard, AdminCardHeader, AdminIcons } from './adminUi'

export function BillingTemplatesPanel({
  tenantId,
  plan,
  periodEnd,
}: {
  tenantId: string
  plan?: string
  periodEnd?: string | null
}) {
  const [templateId, setTemplateId] = useState<TemplateId>('payment_reminder_3d')
  const [cycle, setCycle] = useState<BillingCycle>('monthly')
  const [planId, setPlanId] = useState<BbxSubscriptionPlanId>(
    plan === 'esencial' || plan === 'premium' ? plan : 'pro',
  )
  const [copied, setCopied] = useState(false)

  const rendered = useMemo(() => {
    return renderBillingTemplate(
      templateId,
      templateQuickVars({
        radioName: tenantId === RADIO.id ? RADIO.name : tenantId,
        planId,
        cycle,
        periodEnd: periodEnd ? new Date(periodEnd).toLocaleDateString('es-CL') : undefined,
        payUrl: typeof window !== 'undefined' ? `${window.location.origin}/suspended` : '/suspended',
      }),
    )
  }, [templateId, tenantId, planId, cycle, periodEnd])

  async function copyBody() {
    await navigator.clipboard.writeText(rendered.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wa = whatsappUrlForTemplate(
    templateId,
    templateQuickVars({
      radioName: tenantId === RADIO.id ? RADIO.name : tenantId,
      planId,
      cycle,
      periodEnd: periodEnd ? new Date(periodEnd).toLocaleDateString('es-CL') : undefined,
    }),
  )

  return (
    <AdminCard accent="#40B9BF">
      <AdminCardHeader title="Plantillas de cobro" icon={<AdminIcons.megaphone />} />
      <p className="px-4 -mt-2 mb-3 text-white/40 text-xs leading-relaxed">
        Mensajes alineados a suscripción mensual/anual · copiar o abrir WhatsApp
      </p>

      <div className="px-4 pb-4 space-y-3 min-w-0">
        <select
          value={templateId}
          onChange={e => setTemplateId(e.target.value as TemplateId)}
          className="w-full rounded-xl px-3 py-2.5 text-sm bg-black/30 border border-white/10 text-white"
        >
          {TEMPLATE_CATALOG.map(t => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.channel})
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          <select
            value={planId}
            onChange={e => setPlanId(e.target.value as BbxSubscriptionPlanId)}
            className="flex-1 min-w-[120px] rounded-xl px-3 py-2 text-xs bg-black/30 border border-white/10 text-white"
          >
            <option value="esencial">Esencial</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>
          <select
            value={cycle}
            onChange={e => setCycle(e.target.value as BillingCycle)}
            className="flex-1 min-w-[100px] rounded-xl px-3 py-2 text-xs bg-black/30 border border-white/10 text-white"
          >
            <option value="monthly">Mensual</option>
            <option value="annual">Anual</option>
          </select>
        </div>

        <pre
          className="text-[11px] text-white/70 whitespace-pre-wrap rounded-xl p-3 max-h-48 overflow-y-auto leading-relaxed"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {rendered.subject ? `Asunto: ${rendered.subject}\n\n` : ''}
          {rendered.body}
        </pre>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyBody}
            className="flex-1 min-w-[120px] py-2.5 rounded-xl text-[11px] font-bold bg-white/8 text-white border border-white/10"
          >
            {copied ? 'Copiado ✓' : 'Copiar texto'}
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[120px] py-2.5 rounded-xl text-[11px] font-bold text-center text-[#07070e]"
            style={{ background: '#25D366' }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </AdminCard>
  )
}
