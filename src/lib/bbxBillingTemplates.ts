import { BBX_CONTACT, bbxWhatsApp } from '@/lib/bbxContent'
import {
  amountForPlan,
  annualTotalClp,
  formatClp,
  getSubscriptionPlanOrDefault,
  type BillingCycle,
  type BbxSubscriptionPlanId,
} from '@/lib/bbxSubscriptionPlans'

export type TemplateId =
  | 'onboarding_welcome'
  | 'payment_reminder_3d'
  | 'grace_warning'
  | 'suspended_notice'
  | 'payment_confirmed'
  | 'annual_offer'
  | 'transfer_instructions'
  | 'contract_summary'

type TemplateVars = Record<string, string | number | undefined>

function fill(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const v = vars[key]
    return v != null ? String(v) : `{{${key}}}`
  })
}

const BASE_VARS = {
  bbxName: BBX_CONTACT.name,
  bbxEmail: BBX_CONTACT.email,
  bbxPhone: BBX_CONTACT.phone,
}

export type BillingTemplate = {
  id: TemplateId
  title: string
  channel: 'whatsapp' | 'email' | 'ui'
  subject?: string
  body: string
}

function planVars(planId: BbxSubscriptionPlanId, cycle: BillingCycle = 'monthly') {
  const plan = getSubscriptionPlanOrDefault(planId)
  return {
    planName: plan.nombre,
    monthlyClp: formatClp(plan.monthlyClp),
    annualClp: formatClp(annualTotalClp(plan)),
    amountDue: formatClp(amountForPlan(planId, cycle)),
    cycleLabel: cycle === 'annual' ? 'anual' : 'mensual',
    setupClp: formatClp(plan.setupClp),
  }
}

export const BBX_BILLING_TEMPLATES: Record<TemplateId, Omit<BillingTemplate, 'id'>> = {
  onboarding_welcome: {
    title: 'Bienvenida tras contratar',
    channel: 'whatsapp',
    body:
      'Hola {{contactName}}, soy {{bbxName}}.\n\n' +
      'Tu radio *{{radioName}}* quedó en plan *{{planName}}* ({{cycleLabel}}).\n\n' +
      '• Cuota: ${{amountDue}} CLP (+ setup ${{setupClp}} ya acordado)\n' +
      '• Próximo vencimiento: {{periodEnd}}\n' +
      '• Panel: {{adminUrl}}\n\n' +
      'Cualquier duda de banners o sorteos, escríbeme por acá.',
  },
  payment_reminder_3d: {
    title: 'Aviso 3 días antes del vencimiento',
    channel: 'whatsapp',
    body:
      'Hola {{contactName}}, te escribe {{bbxName}}.\n\n' +
      'La suscripción BBX de *{{radioName}}* vence el *{{periodEnd}}* (plan {{planName}}).\n\n' +
      'Monto referencia: ${{amountDue}} CLP ({{cycleLabel}}).\n\n' +
      'Puedes pagar con el link que te enviamos o transferencia. Si ya pagaste, ignora este mensaje.',
  },
  grace_warning: {
    title: 'Entró en gracia (app con banner)',
    channel: 'whatsapp',
    body:
      '{{contactName}}, la app de *{{radioName}}* sigue en línea pero entró en *periodo de gracia* hasta el {{graceEnd}}.\n\n' +
      'Regulariza ${{amountDue}} CLP para evitar que los oyentes vean la pantalla de suspensión.\n\n' +
      'Link de pago: {{payUrl}}',
  },
  suspended_notice: {
    title: 'App suspendida',
    channel: 'whatsapp',
    body:
      'Hola {{contactName}}.\n\n' +
      'La app pública de *{{radioName}}* está suspendida por suscripción vencida. El panel admin sigue disponible.\n\n' +
      'Para reactivar: paga ${{amountDue}} CLP (plan {{planName}}, {{cycleLabel}}) o confirma transferencia a BBX.\n\n' +
      '{{payUrl}}',
  },
  payment_confirmed: {
    title: 'Pago confirmado',
    channel: 'whatsapp',
    body:
      '✅ Pago recibido — *{{radioName}}*\n\n' +
      'Plan: {{planName}} · {{cycleLabel}}\n' +
      'Monto: ${{amountPaid}} CLP\n' +
      'Activo hasta: {{periodEnd}}\n\n' +
      'Gracias por seguir con BBX.',
  },
  annual_offer: {
    title: 'Oferta plan anual',
    channel: 'whatsapp',
    body:
      'Hola {{contactName}},\n\n' +
      'Para *{{radioName}}* puedes pasar a plan *anual* {{planName}}:\n\n' +
      '• Mensual: ${{monthlyClp}}/mes\n' +
      '• Anual: ${{annualClp}} (2 meses gratis vs. pagar mes a mes)\n\n' +
      '¿Te preparo el link de Mercado Pago?',
  },
  transfer_instructions: {
    title: 'Instrucciones transferencia',
    channel: 'whatsapp',
    body:
      'Transferencia BBX — *{{radioName}}*\n\n' +
      'Monto: ${{amountDue}} CLP ({{planName}}, {{cycleLabel}})\n' +
      'Concepto: BBX {{radioName}} {{periodMonth}}\n\n' +
      'Avísame con comprobante a este WhatsApp y activamos en minutos.',
  },
  contract_summary: {
    title: 'Resumen comercial (email)',
    channel: 'email',
    subject: 'Resumen suscripción BBX — {{radioName}}',
    body:
      'Estimado/a {{contactName}},\n\n' +
      'Resumen de la suscripción a la plataforma BBX:\n\n' +
      'Radio: {{radioName}}\n' +
      'Plan: {{planName}}\n' +
      'Modalidad: {{cycleLabel}}\n' +
      'Cuota: ${{amountDue}} CLP\n' +
      'Setup inicial (único): ${{setupClp}} CLP\n' +
      'Gracia por impago: {{graceDays}} días calendario\n' +
      'Tras la gracia: la app pública se suspende hasta regularizar\n\n' +
      'Incluye: app PWA, panel admin y módulos según plan contratado.\n' +
      'La venta de publicidad a comercios locales es independiente (Capa 2).\n\n' +
      'Saludos,\n' +
      '{{bbxName}}\n' +
      '{{bbxEmail}} · +{{bbxPhone}}',
  },
}

export function renderBillingTemplate(
  id: TemplateId,
  vars: TemplateVars,
): BillingTemplate {
  const def = BBX_BILLING_TEMPLATES[id]
  const merged = { ...BASE_VARS, ...vars }
  return {
    id,
    ...def,
    subject: def.subject ? fill(def.subject, merged) : undefined,
    body: fill(def.body, merged),
  }
}

export function whatsappUrlForTemplate(id: TemplateId, vars: TemplateVars): string {
  const t = renderBillingTemplate(id, vars)
  return bbxWhatsApp(t.body)
}

export function templateQuickVars(opts: {
  radioName: string
  contactName?: string
  planId?: BbxSubscriptionPlanId
  cycle?: BillingCycle
  periodEnd?: string
  graceEnd?: string
  payUrl?: string
  amountPaid?: number
  adminUrl?: string
  graceDays?: number
}): TemplateVars {
  const planId = opts.planId ?? 'pro'
  const cycle = opts.cycle ?? 'monthly'
  const periodMonth = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
  return {
    radioName: opts.radioName,
    contactName: opts.contactName ?? 'equipo de la radio',
    adminUrl: opts.adminUrl ?? '/admin',
    payUrl: opts.payUrl ?? 'https://bbx-radio-9k9y.vercel.app/suspended',
    periodEnd: opts.periodEnd ?? '—',
    graceEnd: opts.graceEnd ?? '—',
    amountPaid: opts.amountPaid != null ? formatClp(opts.amountPaid) : undefined,
    graceDays: opts.graceDays ?? 7,
    periodMonth,
    ...planVars(planId, cycle),
  }
}

export const TEMPLATE_CATALOG: { id: TemplateId; title: string; channel: BillingTemplate['channel'] }[] =
  (Object.keys(BBX_BILLING_TEMPLATES) as TemplateId[]).map(id => ({
    id,
    title: BBX_BILLING_TEMPLATES[id].title,
    channel: BBX_BILLING_TEMPLATES[id].channel,
  }))
