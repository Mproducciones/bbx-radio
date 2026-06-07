'use client'

import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion/framer'
import { LetterRevealTitle } from '@/components/motion/LetterRevealTitle'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  compact?: boolean
  accent?: string
  /** Entrada letra a letra (Grilla, etc.) */
  letterReveal?: boolean
  /** Título y línea centrados (Grilla) */
  centered?: boolean
  /** Línea de acento bajo el título */
  showLine?: boolean
  className?: string
}

export function SectionHeader({
  title,
  compact,
  accent = 'var(--color-mag-400)',
  letterReveal = false,
  centered = false,
  showLine = true,
  className = '',
}: SectionHeaderProps) {
  const titleClass = `${
    compact
      ? 'font-display text-2xl md:text-4xl text-white leading-none tracking-tight'
      : 'font-display text-3xl md:text-4xl text-white leading-none tracking-tight'
  }${centered ? ' text-center w-full' : ''}`

  const lineDelay = letterReveal ? 0.08 + title.length * 0.045 + 0.12 : 0.15

  return (
    <header className={cn(compact ? 'mb-3 shrink-0 md:mb-5' : 'mb-6', centered && 'text-center', 'min-w-0 max-w-full', className)}>
      {letterReveal ? (
        <LetterRevealTitle text={title} className={titleClass} />
      ) : (
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className={titleClass}
        >
          {title}
        </motion.h1>
      )}
      {showLine && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: lineDelay, ease: EASE_OUT }}
          className={`mt-2 h-px rounded-full${centered ? ' origin-center mx-auto' : ' origin-left'}`}
          style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 40%, transparent 100%)`, maxWidth: 80 }}
        />
      )}
    </header>
  )
}
