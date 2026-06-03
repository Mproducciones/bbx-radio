'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function BbxSectionSheet({
  open,
  title,
  subtitle,
  accent = '#db8918',
  onClose,
  children,
}: {
  open: boolean
  title: string
  subtitle?: string
  accent?: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="fixed z-[90] flex flex-col overflow-hidden md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full md:rounded-2xl md:shadow-2xl"
            style={{
              top: 'max(3rem, env(safe-area-inset-top, 0px))',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#07070e',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            <header
              className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
              style={{ background: 'rgba(7,7,14,0.98)' }}
            >
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                aria-label="Volver"
              >
                ←
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg text-white leading-tight truncate">{title}</h2>
                {subtitle && <p className="text-white/40 text-[10px] truncate">{subtitle}</p>}
              </div>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
