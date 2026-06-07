'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PARTICIPA_HOOKS } from '@/lib/participaCopy'
import { EASE_OUT } from '@/lib/motion/framer'

export function ParticipaHook({ accent = '#db8918' }: { accent?: string }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PARTICIPA_HOOKS.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="participa-hook shrink-0 w-full min-w-0 text-center"
      style={{ '--participa-hook-accent': accent } as React.CSSProperties}
    >
      <span className="participa-hook__pill">Zona interactiva</span>
      <div className="participa-hook__line min-h-[2.1rem] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="participa-hook__text"
          >
            {PARTICIPA_HOOKS[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
