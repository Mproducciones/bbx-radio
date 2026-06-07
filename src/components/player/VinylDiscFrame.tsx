'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { VinylDiscCanvas } from './VinylDiscCanvas'
import { ENVIVO_VINYL_DISC_ID } from '@/lib/player/vinylMetrics'

/** Disco / vinilo giratorio — canvas compartido; en boot el padre aplica transform. */
export function VinylDiscFrame({
  size,
  isPlaying,
  isLoading,
  accent,
  bootMode = false,
  handoffRotationRad = 0,
  children,
}: {
  size: number
  isPlaying: boolean
  isLoading?: boolean
  accent: string
  bootMode?: boolean
  handoffRotationRad?: number
  children: ReactNode
}) {
  const outer = size + 56
  const spinning = !bootMode && (isPlaying || !!isLoading)
  const handoffDeg = (handoffRotationRad * 180) / Math.PI

  const spinTransition = spinning
    ? { repeat: Infinity, duration: 10, ease: 'linear' as const }
    : { duration: 0.35 }

  return (
    <div className="relative flex items-center justify-center" style={{ width: outer, height: outer }}>
      <motion.div
        id={ENVIVO_VINYL_DISC_ID}
        className="absolute inset-0 flex items-center justify-center vinyl-disc-ring"
        initial={false}
        animate={
          bootMode
            ? { rotate: 0 }
            : { rotate: spinning ? [handoffDeg, handoffDeg + 360] : handoffDeg }
        }
        transition={bootMode ? { duration: 0 } : spinTransition}
      >
        <VinylDiscCanvas diameter={outer} />
      </motion.div>

      <div className="relative z-[2] rounded-full overflow-hidden" style={{ width: size, height: size }}>
        {children}
        {!bootMode && (
          <>
            <div
              className="absolute inset-[18%] rounded-full pointer-events-none z-[4]"
              style={{
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 16px rgba(0,0,0,0.35)`,
              }}
              aria-hidden
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[30] pointer-events-none"
              style={{
                width: size * 0.09,
                height: size * 0.09,
                background: 'radial-gradient(circle, #1a1a24 0%, #050508 100%)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9), 0 0 0 2px rgba(255,255,255,0.06)',
              }}
              aria-hidden
            />
          </>
        )}
      </div>
    </div>
  )
}

/** Estilo neumórfico suave para botones del player — inspirado en neumorphism-player (21st). */
export function neumoControlStyle(accent: string, pressed = false): CSSProperties {
  if (pressed) {
    return {
      background: '#0a0a10',
      boxShadow: `inset 4px 4px 10px rgba(0,0,0,0.55), inset -2px -2px 6px rgba(255,255,255,0.03)`,
      border: `1px solid ${accent}25`,
      color: accent,
    }
  }
  return {
    background: 'linear-gradient(145deg, #12121c 0%, #0a0a10 100%)',
    boxShadow: `
      6px 6px 14px rgba(0,0,0,0.5),
      -3px -3px 10px rgba(255,255,255,0.04),
      inset 0 1px 0 rgba(255,255,255,0.07)
    `,
    border: `1px solid ${accent}35`,
    color: accent,
  }
}
