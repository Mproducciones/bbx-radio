'use client'

import { motion, AnimatePresence } from 'framer-motion'

export function SecretHintToast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          className="absolute left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full pointer-events-none"
          style={{
            top: 8,
            background: 'rgba(219,137,24,0.15)',
            border: '1px solid rgba(219,137,24,0.35)',
            boxShadow: '0 4px 24px rgba(219,137,24,0.2)',
          }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#db8918] whitespace-nowrap">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
