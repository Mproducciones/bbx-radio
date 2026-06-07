'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SALUDOS_STEPS } from '@/lib/saludosCopy'

type StepId = 'motivo' | 'escribe'

export function SaludosStepRail({
  active,
  accent,
}: {
  active: StepId
  accent: string
}) {
  const activeIdx = SALUDOS_STEPS.findIndex(s => s.id === active)

  return (
    <div className="saludos-rail shrink-0" role="tablist" aria-label="Pasos del saludo">
      {SALUDOS_STEPS.map((s, i) => {
        const done = i < activeIdx
        const isActive = s.id === active
        return (
          <div
            key={s.id}
            className={cn('saludos-rail__item', (done || isActive) && 'is-lit')}
            style={{ '--rail-accent': accent } as React.CSSProperties}
          >
            {isActive && (
              <motion.div
                layoutId="saludos-rail-glow"
                className="saludos-rail__glow"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="saludos-rail__emoji" aria-hidden>
              {done ? '✓' : s.emoji}
            </span>
            <span className="saludos-rail__label">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
