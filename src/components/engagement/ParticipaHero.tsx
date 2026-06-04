'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { PARTICIPA_HOOKS } from '@/lib/participaCopy'
import { EASE_OUT } from '@/lib/motion/framer'

function RadioWaveBars() {
  return (
    <div className="flex items-end justify-center gap-0.5 h-5 shrink-0" aria-hidden>
      {[0.35, 0.65, 1, 0.55, 0.8, 0.45].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full origin-bottom"
          style={{ background: '#db8918', height: 18 }}
          animate={{ scaleY: [h, 1.1, h * 0.4, 0.95, h] }}
          transition={{ duration: 0.9 + (i % 3) * 0.15, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
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
    <header className="participa-hero shrink-0">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(219,137,24,0.28) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(64,185,191,0.18) 0%, transparent 50%)',
        }}
      />
      <motion.div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-40 blur-2xl pointer-events-none"
        style={{ background: '#7D59B5' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      <div className="participa-hero__inner relative">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="pro-live-badge mb-1.5 inline-flex text-[10px]">
              <span className="pro-live-dot" aria-hidden />
              En vivo · {RADIO.city}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="font-display text-[1.5rem] sm:text-[1.65rem] leading-none tracking-wide text-white"
            >
              Participa
            </motion.h1>
            <p className="text-[11px] text-white/45 mt-0.5 truncate">
              {RADIO.name} · {RADIO.frequency}
            </p>
          </div>
          <RadioWaveBars />
        </div>

        <div className="mt-1.5 h-[1.125rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={hookIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="text-[11px] sm:text-xs font-semibold leading-snug truncate"
              style={{ color: '#f5d4a8' }}
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
