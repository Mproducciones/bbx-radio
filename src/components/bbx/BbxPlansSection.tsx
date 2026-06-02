'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BBX_CONTACT, BBX_PLAN_COMPARE, BBX_PLANS, bbxWhatsApp, type BbxPlan } from '@/lib/bbxContent'
import { BbxPlanPreviewThumb } from './BbxPlanMockup'
import { BbxPlanDetailSheet } from './BbxPlanDetailSheet'

function Check({ on, color }: { on: boolean; color?: string }) {
  if (!on) return <span className="text-white/15 text-xs">—</span>
  return (
    <span className="inline-flex w-4 h-4 items-center justify-center rounded-full text-[9px] font-bold"
      style={{ background: `${color ?? '#00D9A0'}22`, color: color ?? '#00D9A0' }}>✓</span>
  )
}

function PlanCard({ plan, onExamples }: { plan: BbxPlan; onExamples: () => void }) {
  return (
    <article
      className="relative flex flex-col rounded-xl overflow-hidden h-full w-full"
      style={{
        background: '#0e0e16',
        border: plan.popular ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: plan.popular ? `0 12px 36px ${plan.color}18` : undefined,
      }}
    >
      <div className="h-1 w-full shrink-0" style={{ background: plan.color }} />
      <div className="p-4 flex flex-col flex-1">
        {plan.popular && (
          <span className="self-start text-[8px] font-black uppercase px-1.5 py-0.5 rounded mb-1.5"
            style={{ background: plan.color, color: '#07070e' }}>Recomendado</span>
        )}
        <h3 className="font-display text-2xl text-white leading-none">{plan.nombre}</h3>
        <p className="text-white/45 text-xs mt-1 leading-snug">{plan.tagline}</p>

        <div className="mt-2.5 flex items-baseline gap-0.5">
          <span className="text-white/35 text-sm">$</span>
          <span className="text-2xl font-bold text-white tabular-nums">{plan.precio}</span>
          <span className="text-white/35 text-xs ml-0.5">/mes</span>
          <span className="text-white/25 text-[10px] ml-auto">setup ${plan.setup}</span>
        </div>

        <BbxPlanPreviewThumb planId={plan.id} color={plan.color} />

        <p className="text-white/30 text-[10px] mb-3 flex-1">
          Esquemas de pantalla · no es la misma lista de la tarjeta.
        </p>

        <button
          type="button"
          onClick={onExamples}
          className="w-full min-h-[42px] py-2.5 rounded-lg text-xs font-bold active:scale-[0.98] transition-transform mt-auto"
          style={{
            background: plan.popular ? plan.color : `${plan.color}14`,
            color: plan.popular ? '#07070e' : plan.color,
            border: plan.popular ? 'none' : `1px solid ${plan.color}30`,
          }}
        >
          Ver cómo se vería
        </button>
      </div>
    </article>
  )
}

export function BbxPlansSection() {
  const [planOpen, setPlanOpen] = useState<BbxPlan | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const ordered = [BBX_PLANS[0], BBX_PLANS[1], BBX_PLANS[2]]

  return (
    <section id="planes" className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-4 md:mb-6">
        <p className="text-[#db8918] text-[9px] font-bold uppercase tracking-[0.18em] mb-1">Precios claros</p>
        <h2 className="font-display text-2xl md:text-4xl text-white leading-none">Planes BBX</h2>
        <p className="text-white/40 text-xs mt-1">Mensual + setup único · sin permanencia</p>
        <p className="text-white/30 text-[10px] mt-2 leading-relaxed max-w-xl">
          Estos precios son Capa 1 (tu radio paga a BBX). Lo que cobrás a anunciantes por banners es aparte —{' '}
          <a href="#precios-capas" className="text-[#40B9BF] hover:underline">ver las dos capas</a>.
        </p>
      </div>

      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-3 md:items-stretch">
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onExamples={() => setPlanOpen(plan)} />
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
        <button type="button" onClick={() => setShowCompare(v => !v)}
          className="text-xs font-semibold text-white/45 hover:text-white/70 px-3 py-1.5 rounded-full border border-white/8">
          {showCompare ? 'Ocultar comparativa' : 'Comparar planes'}
        </button>
        <a href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, ayúdame a elegir plan BBX.`)}
          target="_blank" rel="noopener noreferrer"
          className="text-xs text-white/35 hover:text-white/55">
          ¿Cuál me conviene? WhatsApp →
        </a>
      </div>

      <AnimatePresence>
        {showCompare && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 overflow-x-auto rounded-xl border border-white/6" style={{ background: '#0e0e16' }}>
            <table className="w-full min-w-[480px] text-xs">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left p-3 text-white/40 font-medium">Incluye</th>
                  {BBX_PLANS.map(p => (
                    <th key={p.id} className="p-3 text-center font-display text-sm" style={{ color: p.color }}>{p.nombre}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BBX_PLAN_COMPARE.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined }}>
                    <td className="p-2.5 pl-3 text-white/55">{row.label}</td>
                    <td className="p-2.5 text-center"><Check on={row.esencial} color="#40B9BF" /></td>
                    <td className="p-2.5 text-center"><Check on={row.pro} color="#db8918" /></td>
                    <td className="p-2.5 text-center"><Check on={row.premium} color="#7D59B5" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      <BbxPlanDetailSheet plan={planOpen} onClose={() => setPlanOpen(null)} />
    </section>
  )
}
