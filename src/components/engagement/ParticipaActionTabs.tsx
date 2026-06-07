'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PARTICIPA_ACTIONS } from '@/lib/participaCopy'

export type ParticipaTab = 'votar' | 'pedir' | 'sorteo'

type ActionTab = { id: ParticipaTab; label: string }

export function ParticipaActionTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: ActionTab[]
  active: ParticipaTab
  onChange: (id: ParticipaTab) => void
}) {
  const activeMeta = PARTICIPA_ACTIONS[active]

  return (
    <div className="participa-modes-wrap shrink-0 w-full min-w-0 max-w-full">
      <div
        className={cn(
          'participa-modes w-full min-w-0 max-w-full',
          tabs.length === 2 ? 'participa-modes--duo' : 'participa-modes--trio',
        )}
        role="tablist"
        aria-label="Formas de participar"
      >
        {tabs.map(({ id, label }) => {
          const meta = PARTICIPA_ACTIONS[id]
          const isActive = active === id

          return (
            <motion.button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(id)}
              whileTap={{ scale: 0.97 }}
              className={cn('participa-mode', isActive && 'is-active')}
              style={{ '--mode-accent': meta.color } as React.CSSProperties}
            >
              {isActive && (
                <motion.div
                  layoutId="participa-mode-glow"
                  className="participa-mode__glow"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className="participa-mode__emoji" aria-hidden>
                {meta.emoji}
              </span>
              <span className="participa-mode__label">{label}</span>
            </motion.button>
          )
        })}
      </div>
      <p className="participa-mode-sub" style={{ color: activeMeta.color }}>
        {activeMeta.hook}
      </p>
    </div>
  )
}
