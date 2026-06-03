import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  compact?: boolean
  accent?: string
}

export function SectionHeader({ title, compact, accent = '#db8918' }: SectionHeaderProps) {
  return (
    <header className={compact ? 'mb-3 shrink-0 md:mb-5' : 'mb-6'}>
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={compact
          ? 'font-display text-2xl md:text-4xl text-white leading-none tracking-wide'
          : 'font-display text-3xl md:text-4xl text-white leading-none tracking-wide'
        }
      >
        {title}
      </motion.h1>
      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-2 h-px origin-left rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 40%, transparent 100%)`, maxWidth: 80 }}
      />
    </header>
  )
}
