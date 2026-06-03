'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FrequencyDial, FrequencyBurst } from './FrequencyDial'

const LR = 65
const DRIP_COUNT = 5
const BURST_RINGS = 3

interface InteractiveLogoProps {
  artSrc: string
  title: string
  frequency: string
  isPlaying: boolean
  primary: string
  secondary: string
  logoDigital: boolean
  logoBurst: boolean
  logoHold: number
  onHoldStart: () => void
  onHoldEnd: () => void
  onTouchEnd: () => void
  onTap: () => void
}

export function InteractiveLogo({
  artSrc,
  title,
  frequency,
  isPlaying,
  primary,
  secondary,
  logoDigital,
  logoBurst,
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
  const burstActive = logoBurst && !logoDigital

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
      {/* Doble toque: ondas + destello 93.3 FM */}
      <AnimatePresence>
        {burstActive && (
          <div className="absolute inset-0 pointer-events-none z-[4]" aria-hidden>
            {Array.from({ length: BURST_RINGS }, (_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full"
                style={{
                  inset: -8 - i * 6,
                  border: `2px solid ${i % 2 === 0 ? primary : secondary}`,
                  boxShadow: `0 0 24px ${primary}50`,
                }}
                initial={{ opacity: 0.85, scale: 0.75 }}
                animate={{ opacity: 0, scale: 1.55 + i * 0.2 }}
                transition={{ duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeOut', delay: i * 0.22 }}
              />
            ))}
            <FrequencyBurst frequency={frequency} primary={primary} secondary={secondary} />
          </div>
        )}
      </AnimatePresence>

      {/* Al derretir: asoma el dial de frecuencia */}
      {melting && melt > 0.35 && (
        <motion.div
          className="absolute inset-0 z-[8] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(1, (melt - 0.35) * 2.2) }}
        >
          <FrequencyDial
            size={LR * 2}
            primary={primary}
            secondary={secondary}
            frequency={frequency}
            active
            compact
          />
        </motion.div>
      )}

      {melting && melt > 0.05 && melt <= 0.35 && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-[5]"
          style={{
            background: `radial-gradient(circle at 50% 42%, ${primary}55 0%, ${secondary}25 35%, transparent 70%)`,
            opacity: Math.min(1, melt * 2),
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      )}

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
            key="freq-dial"
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
            <FrequencyDial
              size={LR * 2}
              primary={primary}
              secondary={secondary}
              frequency={frequency}
              active
            />
          </motion.div>
        ) : (
          <motion.div
            key="img"
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[10]"
            animate={{
              y: melt * 28,
              scale: burstActive ? [1, 1.14, 1.06, 1] : 1 - melt * 0.12,
              opacity: 1 - melt * 0.92,
              filter: melt > 0
                ? `blur(${melt * 10}px) brightness(${1 + melt * 0.4}) saturate(${1 + melt * 0.3})`
                : glitch
                  ? 'hue-rotate(90deg) contrast(1.35)'
                  : 'none',
              boxShadow: burstActive && melt <= 0
                ? [
                    `0 0 22px ${primary}`,
                    `0 0 38px ${secondary}`,
                    `0 0 26px ${primary}`,
                  ]
                : 'none',
              clipPath: melt > 0.05
                ? `ellipse(${88 - melt * 30}% ${92 - melt * 75}% at 50% ${42 + melt * 35}%)`
                : 'circle(50% at 50% 50%)',
            }}
            transition={
              burstActive
                ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.08, ease: 'linear' }
            }
          >
            <motion.div
              className="w-full h-full rounded-full overflow-hidden pointer-events-none"
              animate={{
                rotate: isPlaying ? 360 : 0,
                scale: burstActive ? [1, 1.05, 1] : 1,
              }}
              transition={{
                rotate: { duration: burstActive ? 6 : 24, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.45, repeat: burstActive ? Infinity : 0, ease: 'easeInOut' },
              }}
            >
              <Image
                src={artSrc}
                alt=""
                width={LR * 2}
                height={LR * 2}
                priority
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
