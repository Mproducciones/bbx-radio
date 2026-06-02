'use client'

import { useEffect, useRef } from 'react'

const CHARS = '01アイウエオPULSOFMラジオ♪◆▓░#@/\\|{}[]'

interface MatrixLogoProps {
  size: number
  primary: string
  active: boolean
}

export function MatrixLogo({ size, primary, active }: MatrixLogoProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const colsRef = useRef<{ y: number; speed: number; char: string }[]>([])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cols = Math.floor(size / 10)
    colsRef.current = Array.from({ length: cols }, () => ({
      y: Math.random() * size,
      speed: 0.6 + Math.random() * 1.8,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
    }))

    let frame = 0
    let raf = 0
    const cx = size / 2
    const cy = size / 2
    const radius = size * 0.42

    function draw() {
      ctx!.fillStyle = 'rgba(7,7,14,0.22)'
      ctx!.fillRect(0, 0, size, size)

      frame++
      const pulse = 0.85 + Math.sin(frame * 0.04) * 0.15

      for (let i = 0; i < colsRef.current.length; i++) {
        const col = colsRef.current[i]
        const x = (i + 0.5) * (size / cols)
        col.y += col.speed
        if (col.y > size + 20) {
          col.y = -12
          col.char = CHARS[Math.floor(Math.random() * CHARS.length)]
          col.speed = 0.6 + Math.random() * 1.8
        }

        const dist = Math.hypot(x - cx, col.y - cy)
        const inside = dist < radius
        const alpha = inside
          ? 0.35 + (1 - dist / radius) * 0.65
          : dist < radius + 18
            ? 0.08
            : 0.03

        ctx!.font = inside ? 'bold 11px monospace' : '10px monospace'
        ctx!.fillStyle = inside
          ? `rgba(219,137,24,${alpha * pulse})`
          : `rgba(64,185,191,${alpha})`
        ctx!.fillText(col.char, x - 4, col.y)

        if (inside && frame % 8 === i % 8) {
          ctx!.fillStyle = `rgba(255,255,255,${0.15 * pulse})`
          ctx!.fillText(CHARS[(frame + i) % CHARS.length], x - 4, col.y - 12)
        }
      }

      // Anillo digital
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx!.strokeStyle = `rgba(219,137,24,${0.25 + Math.sin(frame * 0.06) * 0.12})`
      ctx!.lineWidth = 1.5
      ctx!.stroke()

      // Texto central
      ctx!.font = 'bold 9px monospace'
      ctx!.fillStyle = `rgba(219,137,24,${0.5 + Math.sin(frame * 0.08) * 0.3})`
      ctx!.textAlign = 'center'
      ctx!.fillText('PULSO', cx, cy + 3)
      ctx!.font = '8px monospace'
      ctx!.fillStyle = 'rgba(64,185,191,0.6)'
      ctx!.fillText('93.3', cx, cy + 14)
      ctx!.textAlign = 'left'

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [size, primary, active])

  if (!active) return null

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className="absolute inset-0 w-full h-full rounded-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden
    />
  )
}
