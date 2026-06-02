'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BBX_CONTACT,
  BBX_PLAN_COMPARE,
  BBX_PLANS,
  bbxWhatsApp,
  type BbxPlan,
} from '@/lib/bbxContent'

function Check({ on, color }: { on: boolean; color?: string }) {
  if (!on) return <span className="text-white/15">—</span>
  return (
    <span className="inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-bold"
      style={{ background: `${color ?? '#00D9A0'}25`, color: color ?? '#00D9A0' }}
    >
      ✓
    </span>
  )
}

function PlanCard({ plan, onDetail }: { plan: BbxPlan; onDetail: () => void }) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl overflow-hidden h-full ${plan.popular ? 'md:-mt-3 md:mb-3 md:scale-[1.02]' : ''}`}
      style={{
        background: '#0e0e16',
        border: plan.popular ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: plan.popular ? `0 24px 60px ${plan.color}22` : '0 8px 32px rgba(0,0,0,0.35)',
      }}
    >
      <div className="h-1.5 w-full shrink-0" style={{ background: plan.color }} />

      <div className="p-5 md:p-6 flex flex-col flex-1">
        {plan.popular && (
          <span className="self-start text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ background: plan.color, color: '#07070e' }}
          >
            Recomendado
          </span>
        )}

        <h3 className="font-display text-3xl text-white leading-none">{plan.nombre}</h3>
        <p className="text-white/45 text-sm mt-2 leading-snug min-h-[2.5rem]">{plan.tagline}</p>

        <div className="mt-5 mb-1 flex items-baseline gap-1">
          <span className="text-white/40 text-lg">$</span>
          <span className="text-white text-4xl font-bold tabular-nums tracking-tight">{plan.precio}</span>
          <span className="text-white/35 text-sm ml-1">/mes</span>
        </div>
        <p className="text-white/30 text-xs mb-5">
          Setup único <span className="text-white/50 font-semibold">${plan.setup}</span>
          {plan.popular && (
            <span className="block mt-1 text-[#00D9A0]">
              Se paga solo con 3 banners a $50.000
            </span>
          )}
        </p>

        <p className="text-white/55 text-xs mb-4 pb-4 border-b border-white/6 leading-relaxed">
          {plan.ideal}
        </p>

        <ul className="space-y-2.5 flex-1 mb-6">
          {plan.features.map(f => (
            <li key={f} className="flex gap-2.5 text-sm text-white/75">
              <Check on={true} color={plan.color} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 mt-auto">
          <a
            href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, quiero el plan ${plan.nombre} de BBX.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl text-sm font-bold text-center transition-opacity hover:opacity-90"
            style={{
              background: plan.popular ? plan.color : 'rgba(255,255,255,0.08)',
              color: plan.popular ? '#07070e' : '#fff',
            }}
          >
            Quiero {plan.nombre}
          </a>
          <button
            type="button"
            onClick={onDetail}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white/45 hover:text-white/70"
          >
            Ver todo incluido
          </button>
        </div>
      </div>
    </article>
  )
}

function PlanModal({ plan, onClose }: { plan: BbxPlan; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal
        className="fixed z-[81] inset-x-0 bottom-0 mx-auto w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-3xl"
        style={{ background: '#0e0e16', borderTop: `2px solid ${plan.color}` }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        <div className="p-6">
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />
          <h3 className="font-display text-4xl text-white">{plan.nombre}</h3>
          <p className="text-white/50 text-sm mt-2">{plan.ideal}</p>
          <p className="mt-4 text-3xl font-bold text-white tabular-nums">
            ${plan.precio}<span className="text-base font-normal text-white/40">/mes</span>
          </p>
          <ul className="mt-6 space-y-3">
            {plan.features.map(f => (
              <li key={f} className="flex gap-3 text-sm text-white/80">
                <Check on={true} color={plan.color} />
                {f}
              </li>
            ))}
          </ul>
          <a
            href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, quiero el plan ${plan.nombre}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex justify-center w-full py-3.5 rounded-xl font-bold"
            style={{ background: plan.color, color: '#07070e' }}
          >
            Consultar por WhatsApp
          </a>
          <button type="button" onClick={onClose} className="w-full mt-3 py-2 text-white/40 text-sm">Cerrar</button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function BbxPlansSection() {
  const [planOpen, setPlanOpen] = useState<BbxPlan | null>(null)
  const [showCompare, setShowCompare] = useState(false)

  const ordered = [BBX_PLANS[1], BBX_PLANS[0], BBX_PLANS[2]] // Pro center on desktop

  return (
    <section id="planes" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-[#db8918] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Precios claros</p>
        <h2 className="font-display text-4xl md:text-5xl text-white leading-none mb-3">Elige tu plan</h2>
        <p className="text-white/45 text-sm">Mensualidad + setup único. Sin permanencia forzada.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {ordered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onDetail={() => setPlanOpen(plan)} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setShowCompare(v => !v)}
          className="text-sm font-semibold text-white/50 hover:text-white border border-white/10 px-5 py-2.5 rounded-full"
        >
          {showCompare ? 'Ocultar comparativa' : 'Comparar planes lado a lado'}
        </button>
      </div>

      <AnimatePresence>
        {showCompare && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 overflow-x-auto rounded-2xl border border-white/8"
            style={{ background: '#0e0e16' }}
          >
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-4 text-white/40 font-medium">Incluye</th>
                  {BBX_PLANS.map(p => (
                    <th key={p.id} className="p-4 text-center font-display text-lg" style={{ color: p.color }}>
                      {p.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BBX_PLAN_COMPARE.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : undefined }}>
                    <td className="p-3 pl-4 text-white/60">{row.label}</td>
                    <td className="p-3 text-center"><Check on={row.esencial} color="#40B9BF" /></td>
                    <td className="p-3 text-center"><Check on={row.pro} color="#db8918" /></td>
                    <td className="p-3 text-center"><Check on={row.premium} color="#7D59B5" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {planOpen && <PlanModal plan={planOpen} onClose={() => setPlanOpen(null)} />}
    </section>
  )
}
