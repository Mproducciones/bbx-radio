'use client'

import type { CSSProperties, ReactNode } from 'react'

/** Disco / vinilo giratorio detrás del artwork — inspirado en music-artwork (21st). */
export function VinylDiscFrame({
  size,
  isPlaying,
  accent,
  children,
}: {
  size: number
  isPlaying: boolean
  accent: string
  children: ReactNode
}) {
  const outer = size + 56

  return (
    <div className="relative flex items-center justify-center" style={{ width: outer, height: outer }}>
      <div
        className="absolute rounded-full"
        style={{
          width: outer,
          height: outer,
          animation: isPlaying ? 'spin-slow 10s linear infinite' : undefined,
          background: `
            radial-gradient(circle at 50% 50%, #050508 0%, #0c0c12 38%, #08080e 100%),
            repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)
          `,
          boxShadow: `
            inset 0 0 48px rgba(0,0,0,0.85),
            0 0 0 1px rgba(255,255,255,0.06),
            0 0 32px ${accent}22
          `,
        }}
      />
      <div
        className="absolute rounded-full border border-white/[0.04]"
        style={{
          width: size + 28,
          height: size + 28,
          animation: isPlaying ? 'spin-slow 10s linear infinite' : undefined,
          background: `conic-gradient(from 0deg, ${accent}12, transparent 25%, ${accent}08, transparent 50%, ${accent}10, transparent 75%, ${accent}08)`,
        }}
      />
      <div className="relative z-[2] rounded-full overflow-hidden" style={{ width: size, height: size }}>
        {children}
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
