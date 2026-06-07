'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { SALUDOS_HOOKS } from '@/lib/saludosCopy'
import { EASE_OUT } from '@/lib/motion/framer'

function WarmWaveBars() {
  return (
    <div className="saludos-hero__waves flex items-end justify-center gap-1 h-6 shrink-0" aria-hidden>
      {[
        { color: '#db8918', h: 0.45 },
        { color: '#FF006E', h: 0.72 },
        { color: '#40B9BF', h: 1 },
        { color: '#db8918', h: 0.58 },
      ].map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full origin-bottom"
          style={{ background: bar.color, height: 20, opacity: 0.8 }}
          animate={{ scaleY: [bar.h, 1.08, bar.h * 0.4, 0.92, bar.h] }}
          transition={{ duration: 1.05, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function SaludosHero() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SALUDOS_HOOKS.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="saludos-hero shrink-0 w-full min-w-0 max-w-full overflow-hidden">
      <div className="saludos-hero__mesh" aria-hidden />
      <motion.div
        className="saludos-hero__orb saludos-hero__orb--a"
        animate={{ scale: [1, 1.14, 1], opacity: [0.28, 0.48, 0.28] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className="saludos-hero__orb saludos-hero__orb--b"
        animate={{ scale: [1, 1.1, 1], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        aria-hidden
      />

      <div className="saludos-hero__inner">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="saludos-hero__badge mb-2 inline-flex">
              <span className="saludos-hero__badge-dot" aria-hidden />
              Directo a cabina · {RADIO.city}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
              className="saludos-hero__title font-display text-white leading-none"
            >
              Saludos
            </motion.h1>
          </div>
          <WarmWaveBars />
        </div>

        <div className="mt-2 min-h-[2.35rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className="saludos-hero__hook line-clamp-2"
            >
              {SALUDOS_HOOKS[idx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="saludos-hero__wave" aria-hidden />
    </header>
  )
}
