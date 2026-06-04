'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlanId } from '@/lib/sponsorPlans'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { SponsorPlanIcon } from '@/components/shared/SponsorPlanIcon'
import { ProWaButton } from '@/components/shared/ProWaButton'
import { PlanDetailSheet } from './PlanDetailSheet'

function PlanCard({
  plan,
  onSelect,
  index,
}: {
  plan: (typeof SPONSOR_PLANS)[number]
  onSelect: () => void
  index: number
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.99 }}
      className={`pro-plan-card w-full min-w-0 max-w-full text-left overflow-hidden ${plan.popular ? 'pro-plan-card--featured' : ''}`}
      style={{ '--plan-accent': plan.color } as React.CSSProperties}
    >
      <div className="pro-plan-stripe" />

      <div className="p-5">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="pro-icon-tile" style={{ '--plan-accent': plan.color } as React.CSSProperties}>
            <SponsorPlanIcon planId={plan.id} className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-white font-semibold text-base max-md:text-[15px] tracking-tight">{plan.nombre}</span>
              {plan.popular && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${plan.color} 22%, transparent)`,
                    color: plan.color,
                    border: `1px solid color-mix(in srgb, ${plan.color} 45%, transparent)`,
                  }}
                >
                  Recomendado
                </span>
              )}
            </div>
            <p className="text-white/45 text-xs leading-relaxed">{plan.tagline}</p>
          </div>

          <div className="shrink-0 text-right pl-1 max-w-[38%]">
            <p
              className="font-display text-2xl max-md:text-xl leading-none tabular-nums tracking-wide truncate"
              style={{ color: plan.color }}
            >
              ${plan.precio}
            </p>
            <p className="text-white/30 text-[10px] mt-1 font-medium">CLP / mes</p>
          </div>
        </div>

        <ul className="space-y-2.5 mb-4">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2.5">
              <span
                className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${plan.color} 20%, transparent)` }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2 6l3 3 5-5"
                    stroke={plan.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-white/70 text-sm leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        <div
          className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06] text-xs font-semibold"
          style={{ color: plan.color }}
        >
          <span>Ver pantallas del plan</span>
          <ChevronRight className="w-4 h-4 opacity-80" strokeWidth={2.5} aria-hidden />
        </div>
      </div>
    </motion.button>
  )
}

const FAQ_SHORT = [
  { q: '¿Puedo empezar con el plan Básico?', a: 'Sí. Es ideal para probar. Mes a mes, sin permanencia.' },
  { q: '¿Necesito diseño o audio?', a: 'No obligatorio. Grabamos el spot y hacemos el banner con plantilla.' },
  { q: '¿Cuánto tarda en activarse?', a: '48 horas hábiles desde que coordinamos el arte y el pago.' },
]

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="pro-faq">
      {FAQ_SHORT.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="pro-faq-item" data-open={isOpen ? 'true' : 'false'}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-white/80 text-sm font-medium leading-snug">{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-white/35 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                strokeWidth={2.5}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-white/50 text-sm leading-relaxed border-t border-white/[0.05] pt-3">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

const TRUST_PILLS = ['Desde $80.000', 'Sin permanencia', 'Activo en 48h']

export function SponsorLanding({ initialListeners = 0 }: { initialListeners?: number }) {
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null
  const waLink = sponsorWaLink()

  const listenerProof =
    initialListeners > 0
      ? `${initialListeners}+ oyentes conectados`
      : 'Audiencia local en vivo'

  const stats = [
    { v: '+15K', l: 'alcance/mes', c: 'var(--color-mag-400)' },
    { v: '20+', l: 'años al aire', c: 'var(--color-cyn-400)' },
    { v: '93.3', l: RADIO.city, c: 'var(--color-pur-400)' },
  ]

  return (
    <div className="app-gutter-x relative w-full min-w-0 max-w-full overflow-x-hidden pb-4">

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="pro-hero-panel pro-hero-panel--sales mb-6"
      >
        <div className="pro-hero-glow" aria-hidden />

        <div className="relative z-[1] flex flex-col items-center">
          <span className="pro-live-badge mb-3">
            <span className="pro-live-dot" aria-hidden />
            {listenerProof}
          </span>

          <p className="pro-eyebrow mb-3">
            Publicidad · {RADIO.name} {RADIO.frequency}
          </p>

          <h1 className="font-display text-[clamp(1.75rem,7.5vw,2.15rem)] text-white leading-[1.04] tracking-wide mb-3 max-w-[18rem] sm:max-w-md mx-auto">
            Tu negocio donde
            <span className="block text-gradient-gold mt-1">te escuchan y te ven</span>
          </h1>

          <p className="text-white/55 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
            Spots en FM + banner en la app. Llega a quien ya consume {RADIO.name} en {RADIO.city}.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {TRUST_PILLS.map(pill => (
              <span key={pill} className="pro-trust-pill">
                {pill}
              </span>
            ))}
          </div>

          <div className="pro-stat-strip pro-stat-strip--center w-full max-w-md mb-5">
            {stats.map(s => (
              <div key={s.l} className="pro-stat-cell">
                <p className="font-display text-2xl leading-none tabular-nums" style={{ color: s.c }}>
                  {s.v}
                </p>
                <p className="text-white/35 text-[10px] mt-1 font-medium uppercase tracking-wide">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm">
            <ProWaButton href={waLink} className="btn-shimmer">
              Quiero cotizar ahora
            </ProWaButton>
            <p className="text-white/35 text-[11px] mt-2.5 font-medium">
              Respondemos en menos de 2 horas · Sin compromiso
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mb-6">
        <p className="pro-eyebrow text-center mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Elige tu plan
        </p>
        <div className="space-y-3">
          {SPONSOR_PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} onSelect={() => setSelectedId(plan.id)} />
          ))}
        </div>
      </div>

      <div className="mb-8 w-full min-w-0 box-border">
        <ProWaButton href={waLink}>Hablar por WhatsApp</ProWaButton>
        <p className="text-center text-white/30 text-xs mt-3 font-medium">
          Te armamos la propuesta según tu rubro y presupuesto
        </p>
      </div>

      <div className="mb-6">
        <p className="pro-eyebrow text-center mb-3" style={{ color: 'rgba(255,255,255,0.32)' }}>
          Preguntas frecuentes
        </p>
        <FaqAccordion />
      </div>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />
    </div>
  )
}
