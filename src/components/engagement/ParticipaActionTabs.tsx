'use client'

import { motion } from 'framer-motion'
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
  return (
    <div className="participa-segment w-full min-w-0 max-w-full" role="tablist" aria-label="Formas de participar">
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
            className={`participa-segment__btn ${isActive ? 'is-active' : ''}`}
            style={
              isActive
                ? ({
                    '--tab-accent': meta.color,
                    background: `linear-gradient(135deg, ${meta.color}, color-mix(in srgb, ${meta.color} 72%, #fff))`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <span className="participa-segment__emoji text-base leading-none" aria-hidden>
              {meta.emoji}
            </span>
            <span className="truncate">{label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
