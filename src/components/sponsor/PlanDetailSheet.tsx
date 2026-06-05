'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SponsorPlan } from '@/lib/sponsorPlans'
import { PlanMockup } from './PlanMockup'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { VisualSchemaFrame } from '@/components/shared/VisualSchemaFrame'
import { SheetPortal } from '@/components/shared/SheetPortal'
import { ProWaButton } from '@/components/shared/ProWaButton'
import { PlanDeliverablesChecklist } from '@/components/sponsor/PlanDeliverablesChecklist'

interface PlanDetailSheetProps {
  plan: SponsorPlan | null
  onClose: () => void
}

export function PlanDetailSheet({ plan, onClose }: PlanDetailSheetProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!plan) {
      delete document.body.dataset.planSheetOpen
      return
    }
    setActiveIdx(0)
    document.body.dataset.planSheetOpen = 'true'
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      delete document.body.dataset.planSheetOpen
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
              className="plan-detail-sheet__backdrop fixed inset-0 z-[1100] bg-black/85 backdrop-blur-sm max-md:hidden"
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
              className="plan-detail-sheet fixed z-[1101] flex flex-col min-h-0 min-w-0 overflow-hidden"
              style={{ '--plan-accent': plan.color } as React.CSSProperties}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="plan-detail-sheet__handle shrink-0 md:flex justify-center pt-2.5 pb-0.5 hidden" aria-hidden>
                <div className="w-10 h-1 rounded-full bg-white/25" />
              </div>

              <header className="plan-detail-sheet__header shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="plan-detail-sheet__nav-btn"
                  aria-label="Volver a los planes"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0 text-white/80" strokeWidth={2.5} aria-hidden />
                  <span className="text-left leading-none hidden min-[360px]:block">
                    <span className="block text-[9px] font-bold uppercase tracking-wide text-white/40">Volver</span>
                    <span className="block text-[11px] font-semibold text-white mt-0.5">Planes</span>
                  </span>
                </button>
                <div className="min-w-0 flex-1 text-center px-1">
                  <h2 id="plan-detail-title" className="font-display text-base md:text-lg text-white leading-tight truncate">
                    {plan.nombre}
                  </h2>
                  <p className="text-[10px] text-white/40">${plan.precio}/mes · vista previa</p>
                </div>
                <Link
                  href="/"
                  className="plan-detail-sheet__live-link shrink-0"
                  aria-label="Ir a la radio en vivo"
                >
                  <Home className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                  <span className="hidden min-[380px]:inline">En vivo</span>
                </Link>
              </header>

              <div
                className="plan-detail-sheet__tabs shrink-0"
                role="tablist"
                aria-label="Pantallas del plan"
              >
                {plan.imagenes.map((img, i) => (
                  <button
                    key={`${plan.id}-${img.id}-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={activeIdx === i}
                    onClick={() => setActiveIdx(i)}
                    className={cn('plan-detail-sheet__tab', activeIdx === i && 'is-active')}
                  >
                    <span className="truncate">{img.caption}</span>
                  </button>
                ))}
              </div>

              <div className="plan-detail-sheet__body flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
                <AnimatePresence mode="wait">
                  {activeImage && (
                    <motion.div
                      key={`${plan.id}-${activeImage.id}-${activeIdx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                      className="plan-detail-sheet__preview"
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

                <div className="plan-detail-sheet__extras">
                  <PlanDeliverablesChecklist planId={plan.id} color={plan.color} />
                </div>
              </div>

              <footer className="plan-detail-sheet__footer shrink-0">
                <ProWaButton
                  href={sponsorWaLink(plan.nombre)}
                  compact
                  className="plan-detail-sheet__quote"
                >
                  Cotizar {plan.nombre} por WhatsApp
                </ProWaButton>
                <button
                  type="button"
                  onClick={onClose}
                  className="plan-detail-sheet__close-btn"
                >
                  Cerrar
                </button>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}
