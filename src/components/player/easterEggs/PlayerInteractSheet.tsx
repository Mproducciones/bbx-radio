'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Binary, Music2, X } from 'lucide-react'

interface PlayerInteractSheetProps {
  open: boolean
  onClose: () => void
  onDigital: () => void
  onCatch: () => void
}

export function PlayerInteractSheet({ open, onClose, onDigital, onCatch }: PlayerInteractSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="fixed inset-0 z-[200] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed left-0 right-0 bottom-0 z-[201] mx-auto max-w-md rounded-t-3xl px-5 pt-5 pb-8"
            style={{
              background: 'linear-gradient(180deg, #14101c 0%, #07070e 100%)',
              borderTop: '1px solid rgba(219,137,24,0.25)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#db8918]" />
                <h3 className="font-display text-xl text-white">Interactuar</h3>
              </div>
              <button type="button" onClick={onClose} className="p-2 text-white/30" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/35 text-xs mb-4 leading-relaxed">
              Experiencias secretas de PULSO. Funcionan mejor con la radio sonando.
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={onDigital}
                className="flex items-center gap-4 p-4 rounded-2xl text-left w-full"
                style={{
                  background: 'rgba(219,137,24,0.1)',
                  border: '1px solid rgba(219,137,24,0.3)',
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(219,137,24,0.2)' }}>
                  <Binary className="w-5 h-5 text-[#db8918]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Modo PULSO · Código</p>
                  <p className="text-white/35 text-xs mt-0.5">Logo digital animado · doble toque en el logo</p>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={onCatch}
                className="flex items-center gap-4 p-4 rounded-2xl text-left w-full"
                style={{
                  background: 'rgba(64,185,191,0.08)',
                  border: '1px solid rgba(64,185,191,0.25)',
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(64,185,191,0.15)' }}>
                  <Music2 className="w-5 h-5 text-[#40B9BF]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Atrapa el ritmo</p>
                  <p className="text-white/35 text-xs mt-0.5">Toca las 3 pistas cuando caiga la nota</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
