'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO_TAGLINE } from '@/lib/radioConfig'

/** Aviso discreto cuando iOS bloquea autoplay — no es mini reproductor */
export function PlayTapHint() {
  const { isPlaying, isLoading, hasError, needsTapToPlay, toggle } = useRadioPlayerContext()

  const show = needsTapToPlay && !isPlaying && !isLoading && !hasError

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          onClick={toggle}
          className="play-tap-hint w-full shrink-0"
          aria-label="Toca para escuchar la radio en vivo"
        >
          <span className="play-tap-hint__dot" aria-hidden />
          <span className="play-tap-hint__text">Toca y suena — {RADIO_TAGLINE}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
