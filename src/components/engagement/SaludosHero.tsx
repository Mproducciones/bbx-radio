'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { EASE_OUT } from '@/lib/motion/framer'

const HOOKS = [
  'Tu mensaje llega directo a cabina',
  'Saludos en vivo · FM 93.3',
  'El locutor lo lee al aire',
]

function WaveBars() {
  return (
    <div className="flex items-end gap-[3px] h-4 shrink-0" aria-hidden>
      {[0.4, 0.75, 1, 0.6, 0.85].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full origin-bottom saludos-hero__bar"
          animate={{ scaleY: [h, 1.05, h * 0.45, 0.9, h] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function SaludosHero() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HOOKS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="saludos-hero shrink-0">
      <div className="saludos-hero__mesh" aria-hidden />
      <motion.div
        className="saludos-hero__orb saludos-hero__orb--a"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
      <div className="saludos-hero__inner">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="saludos-hero__live" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 truncate">
              {RADIO.name}
            </span>
          </div>
          <WaveBars />
        </div>
        <p className="saludos-hero__title font-display text-white leading-none mt-2">
          Saludos al aire
        </p>
        <div className="h-5 mt-1.5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="text-[11px] text-white/45 leading-snug"
            >
              {HOOKS[idx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="saludos-hero__wave" aria-hidden />
    </header>
  )
}
