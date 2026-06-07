'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SALUDOS_HOOKS } from '@/lib/saludosCopy'
import { EASE_OUT } from '@/lib/motion/framer'

export function SaludosHook() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SALUDOS_HOOKS.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="saludos-hook shrink-0 w-full min-w-0 text-center">
      <span className="saludos-hook__pill">ON AIR</span>
      <div className="saludos-hook__line min-h-[2.1rem] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="saludos-hook__text"
          >
            {SALUDOS_HOOKS[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
