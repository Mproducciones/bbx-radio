'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'
import type { SponsorPlan } from '@/lib/sponsorPlans'
import { PlanMockup } from './PlanMockup'
import { sponsorWaLink } from '@/lib/sponsorContent'
import { VisualSchemaFrame } from '@/components/shared/VisualSchemaFrame'
import { SheetPortal } from '@/components/shared/SheetPortal'
import { AccentButton } from '@/components/shared/AccentButton'
import { PlanIncludesDisclosure } from '@/components/shared/PlanIncludesDisclosure'

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
              className="fixed z-[1101] bottom-0 left-1/2 flex flex-col min-h-0 min-w-0 -translate-x-1/2 w-[min(32rem,calc(100vw-2*var(--app-gutter-inline)))] max-w-full rounded-t-[1.35rem] overflow-hidden"
              style={{
                maxHeight: 'min(92dvh, calc(100dvh - env(safe-area-inset-top, 0px) - 0.5rem))',
                background: 'linear-gradient(180deg, #12121c 0%, var(--color-ink-900) 100%)',
                border: `1px solid color-mix(in srgb, ${plan.color} 42%, rgba(255,255,255,0.08))`,
                borderBottom: 'none',
                boxShadow: `0 -20px 64px -12px color-mix(in srgb, ${plan.color} 28%, transparent)`,
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="shrink-0 flex justify-center pt-2.5 pb-0.5">
                <div className="w-10 h-1 rounded-full bg-white/25" />
              </div>

              <div className="shrink-0 px-4 pb-1.5 flex items-center justify-between gap-2 min-w-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 flex items-center gap-2 rounded-xl px-2.5 py-2 min-h-[44px] transition-colors hover:bg-white/[0.08]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  aria-label="Volver a los planes"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0 text-white/80" strokeWidth={2.5} aria-hidden />
                  <span className="text-left leading-none hidden min-[360px]:block">
                    <span className="block text-[9px] font-bold uppercase tracking-wide text-white/40">Volver</span>
                    <span className="block text-[11px] font-semibold text-white mt-0.5">Planes</span>
                  </span>
                </button>
                <div className="min-w-0 flex-1 text-center px-1">
                  <h2 id="plan-detail-title" className="font-display text-base text-white leading-tight truncate">
                    {plan.nombre}
                  </h2>
                  <p className="text-[10px] text-white/40">${plan.precio}/mes · vista previa</p>
                </div>
                <Link
                  href="/"
                  className="shrink-0 flex items-center gap-1.5 rounded-xl px-2.5 py-2 min-h-[44px] text-[10px] font-semibold text-[#40B9BF] hover:text-white transition-colors"
                  style={{ background: 'rgba(64,185,191,0.12)', border: '1px solid rgba(64,185,191,0.22)' }}
                  aria-label="Ir a la radio en vivo"
                >
                  <Home className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                  <span className="hidden min-[380px]:inline">En vivo</span>
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

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-3 [-webkit-overflow-scrolling:touch]">
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

                <PlanIncludesDisclosure
                  items={plan.incluye}
                  accent={plan.color}
                  showList={showList}
                  onToggle={() => setShowList(v => !v)}
                />
              </div>

              <div
                className="shrink-0 px-4 pt-3 flex flex-col gap-2.5 border-t border-white/10 min-w-0"
                style={{
                  background: '#0a0a12',
                  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
                }}
              >
                <AccentButton
                  href={sponsorWaLink(plan.nombre)}
                  accent={plan.color}
                  fullWidth
                  className="max-w-full min-w-0"
                >
                  Cotizar plan {plan.nombre}
                </AccentButton>
                <AccentButton
                  type="button"
                  variant="secondary"
                  accent={plan.color}
                  onClick={onClose}
                  fullWidth
                  shimmer={false}
                  className="max-w-full min-w-0"
                >
                  Cerrar
                </AccentButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}
