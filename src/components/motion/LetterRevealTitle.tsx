'use client'

import { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion/framer'

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getReducedSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedServerSnapshot() {
  return false
}

interface LetterRevealTitleProps {
  text: string
  className?: string
  /** Segundos entre letras */
  stagger?: number
}

/** Título cinematográfico — una letra a la vez. */
export function LetterRevealTitle({ text, className = '', stagger = 0.045 }: LetterRevealTitleProps) {
  const reduced = useSyncExternalStore(subscribeReduced, getReducedSnapshot, getReducedServerSnapshot)

  if (reduced) {
    return (
      <h1 className={className} aria-label={text}>
        {text}
      </h1>
    )
  }

  return (
    <h1 className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.38, delay: 0.08 + i * stagger, ease: EASE_OUT }}
          className={char === ' ' ? 'inline' : 'inline-block'}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  )
}
