'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BBX_CONTACT, type BbxPlan, bbxWhatsApp } from '@/lib/bbxContent'
import { BbxPlanMockup } from './BbxPlanMockup'
import { VisualSchemaFrame } from '@/components/shared/VisualSchemaFrame'
import { SheetPortal } from '@/components/shared/SheetPortal'
import { PlanIncludesDisclosure } from '@/components/shared/PlanIncludesDisclosure'

export function BbxPlanDetailSheet({ plan, onClose }: { plan: BbxPlan | null; onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    if (!plan) return
    setActiveIdx(0)
    setShowList(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [plan])

  const activeImage = plan?.imagenes[activeIdx]

  return (
    <SheetPortal>
      <AnimatePresence>
        {plan && (
          <>
            <motion.button type="button" aria-label="Cerrar" className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

            <motion.div
              key={plan.id}
              role="dialog"
              aria-modal
              className="fixed z-[1101] bottom-0 left-1/2 flex flex-col min-h-0 min-w-0 -translate-x-1/2 w-[min(32rem,calc(100vw-2*var(--app-gutter-inline)))] max-w-full rounded-t-2xl overflow-hidden max-md:max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-0.5rem))] md:max-h-[min(92dvh,720px)]"
            style={{ background: '#0c0c14', borderTop: `2px solid ${plan.color}`, boxShadow: `0 -12px 48px ${plan.color}20` }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="shrink-0 flex justify-center pt-2 pb-0.5"><div className="w-9 h-1 rounded-full bg-white/20" /></div>

            <div className="shrink-0 px-4 pb-1.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-lg text-white leading-none">
                  {plan.nombre} · <span className="text-white/50">${plan.precio}/mes</span>
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">Esquema de producto · setup ${plan.setup}</p>
              </div>
              <button type="button" onClick={onClose} className="shrink-0 text-white/35 text-xs px-2 py-1">✕</button>
            </div>

            <div className="shrink-0 px-4 pb-2">
              <div className="grid grid-cols-1 gap-1.5">
                {plan.imagenes.map((img, i) => (
                  <button
                    key={`${plan.id}-${img.id}`}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className="w-full flex items-center justify-between gap-2 min-h-[44px] px-3 py-2.5 rounded-xl text-left text-xs font-semibold"
                    style={{
                      background: activeIdx === i ? `${plan.color}20` : 'rgba(255,255,255,0.04)',
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
                  <motion.div key={`${plan.id}-${activeIdx}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                    <VisualSchemaFrame
                      callouts={activeImage.callouts}
                      visualNote={activeImage.visualNote}
                      accent={plan.color}
                    >
                      <BbxPlanMockup kind={activeImage.id} color={plan.color} planId={plan.id} large />
                    </VisualSchemaFrame>
                  </motion.div>
                )}
              </AnimatePresence>

              <PlanIncludesDisclosure
                items={plan.features}
                accent={plan.color}
                showList={showList}
                onToggle={() => setShowList(v => !v)}
              />
            </div>

            <div className="shrink-0 px-4 pt-3 border-t border-white/8 min-w-0"
              style={{ background: '#0a0a12', paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0px))' }}>
              <a href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, quiero el plan ${plan.nombre} de BBX.`)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-full max-w-full min-w-0 min-h-[44px] py-3 rounded-xl text-sm font-bold"
                style={{ background: plan.color, color: '#07070e' }}>
                Consultar plan {plan.nombre}
              </a>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </SheetPortal>
  )
}
