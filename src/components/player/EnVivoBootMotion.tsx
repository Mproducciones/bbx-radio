'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT, springSoft } from '@/lib/motion/framer'

const BOOT_KEY = 'pulso_envivo_boot_v3'
const DOT_COUNT = 10
const ORBIT_R = 54

function OrbitingDots({ fading }: { fading: boolean }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360, opacity: fading ? 0 : 1 }}
      transition={{
        rotate: { duration: 5.5, repeat: Infinity, ease: 'linear' },
        opacity: { duration: 0.45, ease: EASE_OUT },
      }}
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => {
        const deg = (360 / DOT_COUNT) * i
        return (
          <motion.span
            key={i}
            className="envivo-boot-dot absolute left-1/2 top-1/2 block rounded-full"
            style={{
              width: i % 2 === 0 ? 6 : 4,
              height: i % 2 === 0 ? 6 : 4,
              marginLeft: i % 2 === 0 ? -3 : -2,
              marginTop: i % 2 === 0 ? -3 : -2,
              transform: `rotate(${deg}deg) translateY(-${ORBIT_R}px)`,
              background: i % 3 === 0 ? '#40B9BF' : '#db8918',
            }}
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
            transition={{
              duration: 1.1 + (i % 4) * 0.12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.07,
            }}
          />
        )
      })}
    </motion.div>
  )
}

/** Apertura: logo + puntos en órbita → se funde con el reproductor. */
export function EnVivoBootMotion({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<'boot' | 'merge' | 'done'>('done')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    if (sessionStorage.getItem(BOOT_KEY)) {
      setPhase('done')
      return
    }
    setPhase('boot')
    const t1 = window.setTimeout(() => setPhase('merge'), 1200)
    const t2 = window.setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem(BOOT_KEY, '1')
    }, 1750)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  const showBoot = ready && phase !== 'done'
  const merging = phase === 'merge'

  return (
    <div className="envivo-boot relative flex flex-col flex-1 min-h-0 min-w-0 w-full">
      <AnimatePresence>
        {showBoot && (
          <motion.div
            key="boot-layer"
            className="envivo-boot__layer absolute inset-0 z-[12] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <motion.div
              className="relative flex items-center justify-center"
              style={{ width: ORBIT_R * 2 + 24, height: ORBIT_R * 2 + 24 }}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{
                scale: merging ? 0.72 : 1,
                opacity: merging ? 0 : 1,
                y: merging ? 8 : 0,
              }}
              transition={merging ? { duration: 0.55, ease: EASE_OUT } : { duration: 0.5, ease: EASE_OUT }}
            >
              <OrbitingDots fading={merging} />
              <motion.img
                src="/icons/icon-512.png"
                alt=""
                draggable={false}
                className="relative z-[1] w-[4.5rem] h-[4.5rem] rounded-full object-contain envivo-boot__logo"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: merging ? 0.9 : 1, opacity: merging ? 0 : 1 }}
                transition={springSoft}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-[1] flex flex-col flex-1 min-h-0 min-w-0"
        initial={false}
        animate={{
          opacity: phase === 'done' || phase === 'merge' ? 1 : 0,
          scale: phase === 'done' ? 1 : phase === 'merge' ? 0.96 : 0.94,
        }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: phase === 'merge' ? 0.08 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
