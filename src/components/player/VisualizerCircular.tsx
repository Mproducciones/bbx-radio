'use client'

import { useEffect, useRef, useCallback } from 'react'

interface VisualizerCircularProps {
  analyser: AnalyserNode | null
  isPlaying: boolean
  primaryColor: string
  secondaryColor: string
  size?: number
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export function VisualizerCircular({
  analyser, isPlaying, primaryColor, secondaryColor, size = 200,
}: VisualizerCircularProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const smoothRef = useRef<Float32Array | null>(null)
  const rotRef    = useRef(0)
  const beatRef   = useRef({ energy: 0, cooldown: 0 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = window.devicePixelRatio || 1
    const W = canvas.width  / DPR
    const H = canvas.height / DPR
    const cx = W / 2, cy = H / 2

    ctx.clearRect(0, 0, W * DPR, H * DPR)
    ctx.scale(DPR, DPR)

    const NUM_BARS = 80
    const R_BASE   = Math.min(W, H) * 0.28
    const R_MAX    = Math.min(W, H) * 0.46

    if (!smoothRef.current) smoothRef.current = new Float32Array(NUM_BARS)
    const smooth = smoothRef.current

    // Leer FFT
    if (analyser) {
      const buf = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(buf)
      for (let i = 0; i < NUM_BARS; i++) {
        const idx    = Math.floor(i * buf.length / NUM_BARS)
        const target = isPlaying ? (buf[idx] / 255) : 0
        smooth[i]    = lerp(smooth[i], target, isPlaying ? 0.25 : 0.06)
      }
    }

    // Beat detection
    let bass = 0
    for (let i = 0; i < 5 && i < smooth.length; i++) bass += smooth[i]
    bass /= 5
    const beat = beatRef.current
    if (bass > 0.45 && performance.now() - beat.cooldown > 350) {
      beat.energy   = 1
      beat.cooldown = performance.now()
    }
    beat.energy = lerp(beat.energy, 0, 0.1)

    // Rotar lentamente el anillo
    rotRef.current += isPlaying ? 0.002 + beat.energy * 0.008 : 0.0003

    // Parsear colores
    function hexRgb(h: string): [number, number, number] {
      const c = h.startsWith('#') ? h : '#db8918'
      return [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]
    }
    const [r1,g1,b1] = hexRgb(primaryColor)
    const [r2,g2,b2] = hexRgb(secondaryColor)

    // ── 1. Anillo base (fondo del círculo) ────────────────────
    ctx.beginPath()
    ctx.arc(cx, cy, R_BASE, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r1},${g1},${b1},0.08)`
    ctx.lineWidth = 1.5
    ctx.stroke()

    // ── 2. Glow interno que late con el bajo ──────────────────
    const glowSize = R_BASE * (0.7 + bass * 0.6 + beat.energy * 0.4)
    const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize)
    innerGlow.addColorStop(0,   `rgba(${r1},${g1},${b1},${0.06 + bass * 0.18 + beat.energy * 0.15})`)
    innerGlow.addColorStop(0.5, `rgba(${r2},${g2},${b2},${0.03 + bass * 0.06})`)
    innerGlow.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = innerGlow
    ctx.beginPath()
    ctx.arc(cx, cy, glowSize, 0, Math.PI * 2)
    ctx.fill()

    // ── 3. Barras radiales ────────────────────────────────────
    for (let i = 0; i < NUM_BARS; i++) {
      const angle  = (i / NUM_BARS) * Math.PI * 2 + rotRef.current
      const val    = smooth[i]
      const barLen = val * (R_MAX - R_BASE)

      if (barLen < 0.5) continue

      const x1 = cx + Math.cos(angle) * R_BASE
      const y1 = cy + Math.sin(angle) * R_BASE
      const x2 = cx + Math.cos(angle) * (R_BASE + barLen)
      const y2 = cy + Math.sin(angle) * (R_BASE + barLen)

      // Interpolar color: bajo → primary, agudos → secondary
      const t   = i / NUM_BARS
      const cr  = lerp(r1, r2, t)
      const cg  = lerp(g1, g2, t)
      const cb  = lerp(b1, b2, t)
      const alpha = 0.4 + val * 0.6

      // Glow en la barra
      ctx.shadowBlur  = val * 12 + beat.energy * 8
      ctx.shadowColor = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},0.8)`

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${alpha})`
      ctx.lineWidth   = 1.5 + val * 1.5
      ctx.lineCap     = 'round'
      ctx.stroke()
    }
    ctx.shadowBlur = 0

    // ── 4. Forma morfológica exterior (mirror) ────────────────
    // Barra espejada — hacia adentro del círculo (efecto duplicado)
    for (let i = 0; i < NUM_BARS; i++) {
      const angle  = (i / NUM_BARS) * Math.PI * 2 + rotRef.current
      const val    = smooth[i] * 0.4
      const barLen = val * R_BASE * 0.7

      if (barLen < 0.5) continue

      const x1 = cx + Math.cos(angle) * R_BASE
      const y1 = cy + Math.sin(angle) * R_BASE
      const x2 = cx + Math.cos(angle) * (R_BASE - barLen)
      const y2 = cy + Math.sin(angle) * (R_BASE - barLen)

      const t   = i / NUM_BARS
      const cr  = lerp(r2, r1, t)
      const cg  = lerp(g2, g1, t)
      const cb  = lerp(b2, b1, t)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${0.15 + val * 0.3})`
      ctx.lineWidth   = 1
      ctx.stroke()
    }

    // ── 5. Onda suavizada en el anillo (path cerrado) ─────────
    ctx.beginPath()
    for (let i = 0; i <= NUM_BARS; i++) {
      const angle = (i / NUM_BARS) * Math.PI * 2 + rotRef.current
      const val   = smooth[i % NUM_BARS]
      const r     = R_BASE + val * (R_MAX - R_BASE) * 0.3
      const x     = cx + Math.cos(angle) * r
      const y     = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else         ctx.lineTo(x, y)
    }
    ctx.closePath()
    const waveGrad = ctx.createLinearGradient(cx - R_MAX, cy, cx + R_MAX, cy)
    waveGrad.addColorStop(0, `rgba(${r1},${g1},${b1},0.25)`)
    waveGrad.addColorStop(0.5, `rgba(${r2},${g2},${b2},0.15)`)
    waveGrad.addColorStop(1, `rgba(${r1},${g1},${b1},0.25)`)
    ctx.strokeStyle = waveGrad
    ctx.lineWidth   = 1
    ctx.stroke()

    // Resetear scale antes del siguiente frame
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    rafRef.current = requestAnimationFrame(draw)
  }, [analyser, isPlaying, primaryColor, secondaryColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const DPR = window.devicePixelRatio || 1
    canvas.width  = size * DPR
    canvas.height = size * DPR
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw, size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="block"
      aria-hidden="true"
    />
  )
}
