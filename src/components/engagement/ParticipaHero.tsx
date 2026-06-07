'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { PARTICIPA_HOOKS } from '@/lib/participaCopy'
import { EASE_OUT } from '@/lib/motion/framer'

function StudioLights() {
  return (
    <div className="participa-hero__lights flex items-end justify-center gap-1 h-6 shrink-0" aria-hidden>
      {[
        { color: '#db8918', h: 0.5 },
        { color: '#40B9BF', h: 0.85 },
        { color: '#7D59B5', h: 1 },
        { color: '#FF006E', h: 0.7 },
        { color: '#00D9A0', h: 0.55 },
      ].map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full origin-bottom"
          style={{ background: bar.color, height: 22 }}
          animate={{ scaleY: [bar.h, 1.12, bar.h * 0.35, 0.95, bar.h] }}
          transition={{ duration: 0.85 + (i % 3) * 0.12, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function ParticipaHero() {
  const [hookIdx, setHookIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHookIdx(i => (i + 1) % PARTICIPA_HOOKS.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="participa-hero shrink-0 overflow-hidden w-full min-w-0 max-w-full">
      <div className="participa-hero__mesh" aria-hidden />
      <motion.div
        className="participa-hero__orb participa-hero__orb--a"
        animate={{ scale: [1, 1.18, 1], opacity: [0.22, 0.42, 0.22] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className="participa-hero__orb participa-hero__orb--b"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.32, 0.15] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        aria-hidden
      />

      <div className="participa-hero__inner relative">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="participa-hero__badge mb-2 inline-flex">
              <span className="participa-hero__badge-dot" aria-hidden />
              Zona interactiva · {RADIO.city}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="participa-hero__title font-display leading-none tracking-wide text-white"
            >
              Participa
            </motion.h1>
          </div>
          <StudioLights />
        </div>

        <div className="mt-2 min-h-[2.35rem] flex items-start">
          <AnimatePresence mode="wait">
            <motion.p
              key={hookIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className="participa-hero__hook line-clamp-2"
            >
              {PARTICIPA_HOOKS[hookIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="participa-hero__wave" aria-hidden />
    </header>
  )
}
