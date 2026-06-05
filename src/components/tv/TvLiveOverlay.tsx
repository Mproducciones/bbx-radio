'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { BienvenidaTV } from './BienvenidaTV'

export function TvLiveOverlay() {
  const { isTvOpen, closeTv } = useRadioPlayerContext()

  useEffect(() => {
    if (!isTvOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTv() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isTvOpen, closeTv])

  return (
    <AnimatePresence>
      {isTvOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Bienvenida TV en vivo"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          className="tv-live-overlay fixed inset-0 z-[2000] flex flex-col"
        >
          <div className="tv-live-overlay__backdrop" aria-hidden />
          <div className="tv-live-overlay__panel flex flex-col flex-1 min-h-0">
            <BienvenidaTV variant="overlay" shouldPlay={isTvOpen} onClose={closeTv} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
