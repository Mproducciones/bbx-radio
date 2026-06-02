'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MatrixLogo } from './MatrixLogo'

const LR = 65

interface InteractiveLogoProps {
  artSrc: string
  title: string
  isPlaying: boolean
  primary: string
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
  logoDigital,
  logoHold,
  onHoldStart,
  onHoldEnd,
  onTouchEnd,
  onTap,
}: InteractiveLogoProps) {
  const [glitch, setGlitch] = useState(false)
  const touchDevice = useRef(false)

  useEffect(() => {
    if (!isPlaying || logoDigital) return
    const id = window.setInterval(() => {
      if (Math.random() > 0.65) {
        setGlitch(true)
        window.setTimeout(() => setGlitch(false), 90)
      }
    }, 18_000)
    return () => window.clearInterval(id)
  }, [isPlaying, logoDigital])

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
      aria-label="Logo. Doble toque o mantén para modo PULSO."
    >
      {logoHold > 0 && !logoDigital && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${logoHold * 289} 289`}
          />
        </svg>
      )}

      {logoHold > 0.15 && !logoDigital && (
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest pointer-events-none z-20 whitespace-nowrap"
          style={{ color: primary }}
        >
          Mantén…
        </span>
      )}

      <AnimatePresence mode="wait">
        {logoDigital ? (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              boxShadow: `0 0 40px ${primary}50, inset 0 0 30px rgba(219,137,24,0.15)`,
              border: `1px solid ${primary}60`,
            }}
          >
            <MatrixLogo size={LR * 2} primary={primary} active />
          </motion.div>
        ) : (
          <motion.div
            key="img"
            animate={{
              opacity: logoHold > 0.3 ? 1 - logoHold * 0.85 : 1,
              filter: logoHold > 0.2
                ? `blur(${logoHold * 6}px) brightness(${1 + logoHold * 0.3})`
                : glitch
                  ? 'hue-rotate(90deg) contrast(1.35)'
                  : 'none',
            }}
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          >
            <motion.div
              className="w-full h-full pointer-events-none"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                src={artSrc}
                alt={title}
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
