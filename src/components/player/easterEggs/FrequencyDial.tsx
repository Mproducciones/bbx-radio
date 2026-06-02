'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const RAIN_CHARS = '0123456789♪★●'

function parseFrequency(frequency: string) {
  const m = frequency.match(/([\d.]+)\s*(FM)?/i)
  return { main: m?.[1] ?? '93.3', fm: (m?.[2] ?? 'FM').toUpperCase() }
}

interface FrequencyDialProps {
  size: number
  primary: string
  secondary: string
  frequency: string
  active: boolean
  compact?: boolean
}

export function FrequencyDial({
  size,
  primary,
  secondary,
  frequency,
  active,
  compact = false,
}: FrequencyDialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { main, fm } = parseFrequency(frequency)
  const chars = main.split('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cols = Math.floor(size / 9)
    const drops = Array.from({ length: cols }, () => ({
      y: Math.random() * size,
      speed: 0.5 + Math.random() * 1.4,
      char: RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)],
    }))

    let frame = 0
    let raf = 0
    const cx = size / 2
    const cy = size / 2
    const radius = size * (compact ? 0.38 : 0.42)

    function draw() {
      ctx!.fillStyle = 'rgba(7,7,14,0.2)'
      ctx!.fillRect(0, 0, size, size)
      frame++

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        const x = (i + 0.5) * (size / cols)
        d.y += d.speed
        if (d.y > size + 16) {
          d.y = -10
          d.char = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]
        }
        const dist = Math.hypot(x - cx, d.y - cy)
        const inside = dist < radius
        ctx!.font = '10px monospace'
        const alpha = inside
          ? Math.floor(90 + (1 - dist / radius) * 165).toString(16).padStart(2, '0')
          : '30'
        ctx!.fillStyle = inside ? `${primary}${alpha}` : `${secondary}${alpha}`
        ctx!.fillText(d.char, x - 4, d.y)
      }

      for (let r = 0; r < 3; r++) {
        const rr = radius * (0.5 + r * 0.16) + Math.sin(frame * 0.05 + r) * 2
        ctx!.beginPath()
        ctx!.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(219,137,24,${0.12 + Math.sin(frame * 0.07 + r) * 0.08})`
        ctx!.lineWidth = 1
        ctx!.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [size, active, primary, secondary, compact])

  if (!active) return null

  const digitSize = compact ? size * 0.2 : size * 0.24

  return (
    <div
      className="absolute inset-0 rounded-full overflow-hidden"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[2]">
        {/* Orbitas lúdicas */}
        {[0, 1, 2].map(i => {
          const orbit = radiusOrbit(size, compact)
          const start = i * 120
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ width: 0, height: 0 }}
              animate={{ rotate: [start, start + 360] }}
              transition={{ duration: 2.4 + i * 0.35, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  left: orbit - 3,
                  top: -3,
                  background: i % 2 === 0 ? primary : secondary,
                  boxShadow: `0 0 10px ${i % 2 === 0 ? primary : secondary}`,
                }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          )
        })}

        <motion.div
          className="flex items-end justify-center"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        >
          {chars.map((ch, i) => (
            <motion.span
              key={`${i}-${ch}`}
              className="font-display leading-none tabular-nums"
              style={{
                fontSize: ch === '.' ? digitSize * 0.65 : digitSize,
                color: primary,
                textShadow: `0 0 ${compact ? 12 : 22}px ${primary}, 0 0 40px ${primary}50`,
                marginBottom: ch === '.' ? digitSize * 0.15 : 0,
              }}
              animate={{
                y: [0, ch === '.' ? -2 : -6, 0],
                rotate: ch === '.' ? 0 : [0, i % 2 === 0 ? -4 : 4, 0],
              }}
              transition={{
                duration: 0.35 + i * 0.07,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.05,
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>

        <motion.span
          className="font-mono font-black tracking-[0.4em] -mr-[0.4em]"
          style={{
            fontSize: compact ? 8 : 10,
            color: secondary,
            textShadow: `0 0 12px ${secondary}80`,
          }}
          animate={{
            opacity: [0.55, 1, 0.55],
            letterSpacing: ['0.32em', '0.48em', '0.32em'],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {fm}
        </motion.span>

        {!compact && (
          <motion.div
            className="flex items-end justify-center gap-[3px] mt-2"
            animate={{ opacity: [0.4, 0.95, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {Array.from({ length: 5 }, (_, b) => (
              <motion.div
                key={b}
                className="rounded-sm"
                style={{ width: 3, background: b % 2 === 0 ? primary : secondary }}
                animate={{ height: [4, 10 + b * 3, 5 + b * 2, 4] }}
                transition={{
                  duration: 0.45 + b * 0.06,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function radiusOrbit(size: number, compact?: boolean) {
  return size * (compact ? 0.32 : 0.36)
}

/** Doble toque: destello de frecuencia sobre el logo normal */
export function FrequencyBurst({
  frequency,
  primary,
  secondary,
}: {
  frequency: string
  primary: string
  secondary: string
}) {
  const { main, fm } = parseFrequency(frequency)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[6]" aria-hidden>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.15, 1], opacity: [0, 1, 0.85] }}
        transition={{ duration: 0.5 }}
        className="flex items-end"
      >
        {main.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="font-display leading-none"
            style={{
              fontSize: ch === '.' ? 18 : 28,
              color: primary,
              textShadow: `0 0 20px ${primary}`,
            }}
            animate={{ y: [0, -8, 0], rotate: [0, 360, 0] }}
            transition={{ duration: 0.6, delay: i * 0.06, repeat: 2 }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>
      <motion.span
        style={{ color: secondary, fontSize: 9, letterSpacing: '0.35em' }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: 2 }}
      >
        {fm}
      </motion.span>
    </div>
  )
}
