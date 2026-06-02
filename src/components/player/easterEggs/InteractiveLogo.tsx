'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MatrixLogo } from './MatrixLogo'

const LR = 65
const DRIP_COUNT = 5

interface InteractiveLogoProps {
  artSrc: string
  title: string
  isPlaying: boolean
  primary: string
  secondary: string
  logoDigital: boolean
  logoHold: number
  onHoldStart: () => void
  onHoldEnd: () => void
  onTouchEnd: () => void
  onTap: () => void
}

export function InteractiveLogo({
  artSrc,
  title,
  isPlaying,
  primary,
  secondary,
  logoDigital,
  logoHold,
  onHoldStart,
  onHoldEnd,
  onTouchEnd,
  onTap,
}: InteractiveLogoProps) {
  const [glitch, setGlitch] = useState(false)
  const touchDevice = useRef(false)
  const melting = logoHold > 0 && !logoDigital

  useEffect(() => {
    if (!isPlaying || logoDigital) return
    const id = window.setInterval(() => {
      if (Math.random() > 0.72) {
        setGlitch(true)
        window.setTimeout(() => setGlitch(false), 80)
      }
    }, 22_000)
    return () => window.clearInterval(id)
  }, [isPlaying, logoDigital])

  const melt = logoHold
  const pulsoVisible = logoDigital || melt > 0.12

  return (
    <div
      className="absolute select-none"
      style={{
        width: LR * 2,
        height: LR * 2,
        top: '50%',
        left: '50%',
        marginTop: -LR,
        marginLeft: -LR,
        borderRadius: '50%',
        zIndex: 25,
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
      onTouchStart={e => {
        touchDevice.current = true
        e.stopPropagation()
        onHoldStart()
      }}
      onTouchEnd={e => {
        e.stopPropagation()
        onTouchEnd()
        onHoldEnd()
      }}
      onTouchCancel={e => {
        e.stopPropagation()
        onHoldEnd()
      }}
      onPointerDown={e => {
        if (touchDevice.current && e.pointerType === 'touch') return
        if (e.button !== 0) return
        onHoldStart()
      }}
      onPointerUp={e => {
        if (touchDevice.current && e.pointerType === 'touch') return
        onHoldEnd()
      }}
      onPointerLeave={e => {
        if (touchDevice.current) return
        onHoldEnd()
      }}
      onClick={e => {
        e.stopPropagation()
        onTap()
      }}
      role="button"
      tabIndex={0}
      aria-label={title}
    >
      {/* PULSO — revelado al derretir el logo */}
      <AnimatePresence>
        {pulsoVisible && (
          <motion.div
            key="pulso"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: logoDigital ? 1 : Math.min(1, melt * 1.4),
              scale: logoDigital ? 1 : 0.88 + melt * 0.14,
            }}
            exit={{ opacity: 0, scale: 1.08 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[5]"
          >
            <span
              className="font-display leading-none tracking-[0.18em]"
              style={{
                fontSize: logoDigital ? 28 : 22 + melt * 8,
                color: primary,
                textShadow: `0 0 ${20 + melt * 30}px ${primary}, 0 0 60px ${primary}80`,
                filter: logoDigital ? 'none' : `blur(${(1 - melt) * 3}px)`,
              }}
            >
              PULSO
            </span>
            {logoDigital && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-mono text-[8px] tracking-widest mt-0.5"
                style={{ color: secondary }}
              >
                FM · 93.3
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gotas de derretimiento */}
      {melting && (
        <div className="absolute inset-0 pointer-events-none z-[15]" aria-hidden>
          {Array.from({ length: DRIP_COUNT }, (_, i) => {
            const x = 18 + i * 14
            const h = 6 + melt * (22 + i * 6)
            return (
              <motion.div
                key={i}
                className="absolute rounded-b-full"
                style={{
                  left: `${x}%`,
                  top: `${58 + melt * 18}%`,
                  width: 7 + (i % 2) * 3,
                  height: h,
                  background: `linear-gradient(180deg, ${primary}cc, ${primary}40)`,
                  boxShadow: `0 0 8px ${primary}60`,
                  transformOrigin: 'top center',
                }}
                animate={{
                  scaleY: [1, 1.15, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 0.45 + i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
              />
            )
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {logoDigital ? (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="absolute inset-0 rounded-full overflow-hidden z-[20]"
            style={{
              boxShadow: `0 0 48px ${primary}60, inset 0 0 36px rgba(219,137,24,0.2)`,
              border: `1px solid ${primary}70`,
            }}
          >
            <MatrixLogo size={LR * 2} primary={primary} active />
          </motion.div>
        ) : (
          <motion.div
            key="img"
            className="absolute inset-0 rounded-full overflow-visible pointer-events-none z-[10]"
            animate={{
              y: melt * 28,
              scale: 1 - melt * 0.12,
              opacity: 1 - melt * 0.92,
              filter: melt > 0
                ? `blur(${melt * 10}px) brightness(${1 + melt * 0.4}) saturate(${1 + melt * 0.3})`
                : glitch
                  ? 'hue-rotate(90deg) contrast(1.35)'
                  : 'none',
              clipPath: melt > 0.05
                ? `ellipse(${88 - melt * 30}% ${92 - melt * 75}% at 50% ${42 + melt * 35}%)`
                : 'circle(50% at 50% 50%)',
            }}
            transition={{ duration: 0.08, ease: 'linear' }}
          >
            <motion.div
              className="w-full h-full rounded-full overflow-hidden pointer-events-none"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                src={artSrc}
                alt=""
                width={LR * 2}
                height={LR * 2}
                draggable={false}
                unoptimized={artSrc.startsWith('http')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  filter: isPlaying
                    ? `drop-shadow(0 0 14px ${primary}) drop-shadow(0 0 28px ${primary}60)`
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
