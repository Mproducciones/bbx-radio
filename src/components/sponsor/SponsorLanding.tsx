'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SPONSOR_PLANS, type SponsorPlanId } from '@/lib/sponsorPlans'
import { SPONSOR_FAQ, sponsorWaLink } from '@/lib/sponsorContent'
import { PlanDetailSheet } from './PlanDetailSheet'

// ── Plan card ─────────────────────────────────────────────────────────────────
const PLAN_ICONS: Record<string, string> = {
  basico:      '📻',
  premium:     '⭐',
  empresarial: '🏆',
}

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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      className="w-full text-left rounded-3xl overflow-hidden relative"
      style={{
        background: plan.popular
          ? `linear-gradient(160deg, ${plan.color}22 0%, rgba(255,255,255,0.03) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${plan.popular ? plan.color + '55' : plan.color + '25'}`,
      }}
    >
      {/* Color stripe top */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${plan.color}, ${plan.color}44, transparent)` }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-2xl">{PLAN_ICONS[plan.id]}</span>
              <span className="text-white font-bold text-lg">{plan.nombre}</span>
              {plan.popular && (
                <span
                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                  style={{ background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}44` }}
                >
                  Más elegido
                </span>
              )}
            </div>
            <p className="text-white/40 text-xs leading-snug max-w-[160px]">{plan.tagline}</p>
          </div>

          <div className="text-right shrink-0">
            <p
              className="font-black tabular-nums leading-none"
              style={{ color: plan.color, fontSize: '2rem' }}
            >
              ${plan.precio}
            </p>
            <p className="text-white/30 text-[10px] mt-0.5">al mes · CLP</p>
          </div>
        </div>

        {/* Features — solo 2-3 */}
        <ul className="space-y-2 mb-5">
          {plan.features.map(f => (
            <li key={f} className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill={plan.color} fillOpacity="0.18"/>
                <path d="M4 7l2 2 4-4" stroke={plan.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white/65 text-sm">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA hint */}
        <div
          className="flex items-center justify-between text-xs font-semibold"
          style={{ color: plan.color }}
        >
          <span>Ver pantallas del plan</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.button>
  )
}

// ── FAQ minimal ───────────────────────────────────────────────────────────────
const FAQ_SHORT = [
  { q: '¿Puedo empezar con el plan Básico?', a: 'Sí. Es ideal para probar. Mes a mes, sin permanencia.' },
  { q: '¿Necesito diseño o audio?', a: 'No obligatorio. Grabamos el spot y hacemos el banner con plantilla.' },
  { q: '¿Cuánto tarda en activarse?', a: '48 horas hábiles desde que coordinamos el arte y el pago.' },
]

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="rounded-2xl overflow-hidden border border-white/8 divide-y divide-white/6">
      {FAQ_SHORT.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <span className="text-white/75 text-sm font-medium">{item.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/30 text-lg shrink-0 leading-none"
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-white/45 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function SponsorLanding({ initialListeners }: { initialListeners?: number }) {
  const [selectedId, setSelectedId] = useState<SponsorPlanId | null>(null)
  const selectedPlan = selectedId ? SPONSOR_PLANS.find(p => p.id === selectedId) ?? null : null
  const waLink = sponsorWaLink()

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-1 pt-2 pb-8"
      >
        {/* Eyebrow */}
        <p className="text-[10px] font-black uppercase tracking-widest text-[#40B9BF] mb-3">
          Publicidad · {RADIO.name}
        </p>

        {/* Título — corto, directo */}
        <h1 className="font-bold text-white text-2xl leading-tight mb-3">
          Llega a quien te escucha<br/>
          <span style={{ color: '#db8918' }}>y a quien mira el celular</span>
        </h1>

        {/* 1 sola línea de contexto */}
        <p className="text-white/45 text-sm leading-relaxed mb-4">
          Spots en {RADIO.frequency} + banner en la app.
          Audiencia real en {RADIO.city}.
        </p>

        {/* Stats — mínimos, horizontales */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { v: '+15K', l: 'alcance/mes', c: '#db8918' },
            { v: '20+', l: 'años al aire', c: '#40B9BF' },
            { v: '93.3', l: RADIO.city, c: '#7D59B5' },
          ].map(s => (
            <div key={s.l} className="flex items-baseline gap-1.5">
              <span className="font-black text-lg leading-none" style={{ color: s.c }}>{s.v}</span>
              <span className="text-white/35 text-[10px]">{s.l}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── PLANES ────────────────────────────────────────────────────── */}
      <div className="px-1 pb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">
          Elige tu plan
        </p>

        <div className="space-y-4">
          {SPONSOR_PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i}
              onSelect={() => setSelectedId(plan.id)}
            />
          ))}
        </div>
      </div>

      {/* ── CTA PRINCIPAL ─────────────────────────────────────────────── */}
      <div className="px-1 pb-8">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shimmer flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-base"
          style={{
            background: 'linear-gradient(135deg, #128C7E, #25D366)',
            color: '#fff',
            boxShadow: '0 8px 32px -8px rgba(37,211,102,0.45)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Cotizar por WhatsApp
        </a>

        <p className="text-center text-white/25 text-xs mt-3">
          Respondemos en menos de 2 horas · Sin compromiso
        </p>
      </div>

      {/* ── FAQ — colapsado, mínimo ────────────────────────────────────── */}
      <div className="px-1 pb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">
          Preguntas frecuentes
        </p>
        <FaqAccordion />
      </div>

      {/* Padding bottom para el sticky CTA */}
      <div className="h-20 md:hidden" />

      {/* ── STICKY CTA mobile ─────────────────────────────────────────── */}
      <div
        className="sponsor-sticky-cta md:hidden fixed left-0 right-0 z-[999] pt-3 border-t border-white/8 backdrop-blur-xl"
        style={{
          bottom: 'var(--app-nav-total)',
          background: 'rgba(7,7,14,0.97)',
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shimmer flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, #128C7E, #25D366)',
            color: '#fff',
            boxShadow: '0 6px 24px -6px rgba(37,211,102,0.4)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Cotizar por WhatsApp
        </a>
      </div>

      <PlanDetailSheet plan={selectedPlan} onClose={() => setSelectedId(null)} />
    </div>
  )
}
