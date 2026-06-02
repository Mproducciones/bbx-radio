'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SponsorPlan } from '@/lib/sponsorPlans'
import { PlanMockup } from './PlanMockup'
import { sponsorWaLink } from '@/lib/sponsorContent'

interface PlanDetailSheetProps {
  plan: SponsorPlan | null
  onClose: () => void
}

export function PlanDetailSheet({ plan, onClose }: PlanDetailSheetProps) {
  useEffect(() => {
    if (!plan) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [plan])

  useEffect(() => {
    if (!plan) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [plan, onClose])

  return (
    <AnimatePresence>
      {plan && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-detail-title"
            className="fixed z-[61] left-0 right-0 bottom-0 mx-auto w-full max-w-lg max-h-[min(92dvh,720px)] flex flex-col rounded-t-3xl overflow-hidden"
            style={{
              background: '#0c0c14',
              border: `1px solid ${plan.color}40`,
              boxShadow: `0 -12px 48px ${plan.color}20`,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="shrink-0 px-5 pb-3 flex items-start justify-between gap-3">
              <div>
                {plan.popular && (
                  <span
                    className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-2"
                    style={{ background: plan.color, color: '#07070e' }}
                  >
                    Recomendado
                  </span>
                )}
                <h2 id="plan-detail-title" className="font-display text-2xl text-white leading-none">
                  Plan {plan.nombre}
                </h2>
                <p className="text-white/55 text-sm mt-1">{plan.tagline}</p>
              </div>
              <p className="text-right shrink-0 pt-1">
                <span className="text-white font-bold text-xl">${plan.precio}</span>
                <span className="text-white/40 text-sm block">/mes CLP</span>
              </p>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 space-y-5">
              <p className="text-white/75 text-sm leading-relaxed">{plan.detalle}</p>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-3">
                  Así se ve tu publicidad
                </p>
                <div className="flex flex-col gap-3">
                  {plan.imagenes.map(img => (
                    <div key={img.id}>
                      <PlanMockup kind={img.id} color={plan.color} planId={plan.id} />
                      <p className="text-[11px] text-white/45 mt-1.5 text-center">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                  Qué incluye
                </p>
                <ul className="space-y-2">
                  {plan.incluye.map(item => (
                    <li key={item} className="flex gap-2 text-sm text-white/80">
                      <span className="shrink-0 font-bold" style={{ color: plan.color }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Ideal para</p>
                <p className="text-sm text-white/70">{plan.idealPara}</p>
              </div>
            </div>

            <div
              className="shrink-0 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-2 border-t border-white/10"
              style={{ background: '#0a0a12' }}
            >
              <a
                href={sponsorWaLink(plan.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3.5 rounded-xl text-sm font-bold"
                style={{ background: plan.color, color: '#07070e' }}
              >
                Consultar plan {plan.nombre} por WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-sm font-semibold text-white/50"
              >
                Volver a planes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
