'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { SponsorPlan } from '@/lib/sponsorPlans'
import { PlanMockup } from './PlanMockup'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { VisualSchemaFrame } from '@/components/shared/VisualSchemaFrame'
import { SheetPortal } from '@/components/shared/SheetPortal'

interface PlanDetailSheetProps {
  plan: SponsorPlan | null
  onClose: () => void
}

export function PlanDetailSheet({ plan, onClose }: PlanDetailSheetProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    if (!plan) {
      delete document.body.dataset.sheetOpen
      return
    }
    setActiveIdx(0)
    setShowList(false)
    document.body.dataset.sheetOpen = 'true'
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      delete document.body.dataset.sheetOpen
      document.body.style.overflow = prev
    }
  }, [plan])

  useEffect(() => {
    if (!plan) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [plan, onClose])

  const activeImage = plan?.imagenes[activeIdx]

  return (
    <SheetPortal>
      <AnimatePresence>
        {plan && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar"
              className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              key={plan.id}
              role="dialog"
              aria-modal="true"
              aria-labelledby="plan-detail-title"
              className="fixed z-[1101] inset-x-0 bottom-0 mx-auto w-full max-w-lg flex flex-col rounded-t-[1.35rem] overflow-hidden max-md:h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-0.5rem))] md:max-h-[min(92dvh,720px)]"
              style={{
                background: '#0c0c14',
                border: `1px solid ${plan.color}50`,
                borderBottom: 'none',
                boxShadow: `0 -16px 60px ${plan.color}25`,
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="shrink-0 flex justify-center pt-2.5 pb-0.5">
                <div className="w-10 h-1 rounded-full bg-white/25" />
              </div>

              <div className="shrink-0 px-4 pb-1.5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
                >
                  ← Volver
                </button>
                <div className="min-w-0 flex-1 text-center">
                  <h2 id="plan-detail-title" className="font-display text-base text-white leading-tight truncate">
                    {plan.nombre}
                  </h2>
                  <p className="text-[10px] text-white/40">${plan.precio}/mes · vista previa</p>
                </div>
                <Link
                  href="/"
                  className="shrink-0 text-[10px] font-semibold px-2 py-1.5 rounded-lg text-[#40B9BF]"
                  style={{ background: 'rgba(64,185,191,0.12)' }}
                >
                  App
                </Link>
              </div>

              <div className="shrink-0 px-4 pb-2">
                <div className="grid grid-cols-1 gap-1.5">
                  {plan.imagenes.map((img, i) => (
                    <button
                      key={`${plan.id}-${img.id}-${i}`}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className="w-full flex items-center justify-between gap-2 min-h-[44px] px-3 py-2.5 rounded-xl text-left text-xs font-semibold"
                      style={{
                        background: activeIdx === i ? `${plan.color}22` : 'rgba(255,255,255,0.04)',
                        border: activeIdx === i ? `1.5px solid ${plan.color}` : '1px solid rgba(255,255,255,0.07)',
                        color: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      <span>{img.caption}</span>
                      <span className="text-[10px] shrink-0" style={{ color: activeIdx === i ? plan.color : 'rgba(255,255,255,0.25)' }}>
                        {activeIdx === i ? '●' : '○'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3 [-webkit-overflow-scrolling:touch]">
                <AnimatePresence mode="wait">
                  {activeImage && (
                    <motion.div
                      key={`${plan.id}-${activeImage.id}-${activeIdx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <VisualSchemaFrame
                        callouts={activeImage.callouts}
                        visualNote={activeImage.visualNote}
                        accent={plan.color}
                      >
                        <PlanMockup
                          kind={activeImage.id}
                          color={plan.color}
                          planId={plan.id}
                          large
                        />
                      </VisualSchemaFrame>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setShowList(v => !v)}
                  className="mt-3 w-full text-left text-[10px] font-semibold text-white/35 py-2 border-t border-white/6"
                >
                  {showList ? '▾ Ocultar lista del plan' : '▸ Ver lista completa del plan (texto)'}
                </button>
                <AnimatePresence>
                  {showList && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2 pb-2"
                    >
                      <ul className="space-y-1.5 pt-2">
                        {plan.incluye.map(item => (
                          <li key={item} className="flex gap-2 text-xs text-white/65">
                            <span className="shrink-0" style={{ color: plan.color }}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="shrink-0 px-4 pt-2 flex flex-col gap-2 border-t border-white/10"
                style={{
                  background: '#0a0a12',
                  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full min-h-[40px] py-2 rounded-xl text-xs font-semibold text-white/60 border border-white/10 active:bg-white/5"
                >
                  Cerrar y volver a planes
                </button>
                <a
                  href={sponsorWaLink(plan.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full min-h-[44px] py-3 rounded-xl text-sm font-bold"
                  style={{ background: plan.color, color: '#07070e' }}
                >
                  Cotizar plan {plan.nombre}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}
