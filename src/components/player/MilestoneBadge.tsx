'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Milestone } from '@/hooks/useListeningMilestone'

interface MilestoneBadgeProps {
  milestone: Milestone | null
}

export function MilestoneBadge({ milestone }: MilestoneBadgeProps) {
  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="fixed bottom-24 left-1/2 z-50 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          {/* Confetti dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#FF006E', '#00D4FF', '#FFB300', '#7B2FFF', '#00D9A0'][i % 5],
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 60,
                y: Math.sin((i / 8) * Math.PI * 2) * 60,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
          ))}

          <div
            className="relative flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #1A0A2E, #0F0F1A)',
              border: '1px solid rgba(255,0,110,0.4)',
              boxShadow: '0 8px 40px rgba(255,0,110,0.3)',
            }}
          >
            <span className="text-2xl">{milestone.emoji}</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{milestone.label}</p>
              <p className="text-[#8888AA] text-xs">Radio Bienvenida</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
