'use client'

import { useEffect, useRef, useCallback } from 'react'

interface AtmosphereCanvasProps {
  analyser: AnalyserNode | null
  isPlaying: boolean
  primaryColor: string
  secondaryColor: string
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.startsWith('#') ? hex : '#db8918'
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export function AtmosphereCanvas({ analyser, isPlaying, primaryColor, secondaryColor }: AtmosphereCanvasProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const energyRef   = useRef({ bass: 0, mid: 0, treble: 0, beat: 0, beatAge: 0 })
  const beatCoolRef = useRef(0)
  const ringsRef    = useRef<{ r: number; alpha: number; color: 0 | 1 }[]>([])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W  = canvas.width
    const H  = canvas.height
    const cx = W / 2
    const cy = H * 0.4

    // ── Frecuencias ────────────────────────────────────────────────────────
    const N   = 128
    const buf = new Uint8Array(analyser?.frequencyBinCount ?? 0)
    if (analyser && isPlaying) analyser.getByteFrequencyData(buf)

    let bass = 0, mid = 0
    const total = buf.length || 1
    for (let i = 0; i < Math.floor(total * 0.05); i++) bass += buf[i]
    for (let i = Math.floor(total * 0.05); i < Math.floor(total * 0.3); i++) mid += buf[i]
    bass /= Math.floor(total * 0.05) * 255
    mid  /= Math.floor(total * 0.25) * 255

    const e = energyRef.current
    e.bass = lerp(e.bass, isPlaying ? bass : 0, isPlaying ? 0.2 : 0.05)
    e.mid  = lerp(e.mid,  isPlaying ? mid  : 0, isPlaying ? 0.15 : 0.05)

    // Beat detection
    const now = performance.now()
    if (e.bass > 0.5 && now - beatCoolRef.current > 350) {
      beatCoolRef.current = now
      e.beat    = 1
      e.beatAge = 0
      ringsRef.current.push({ r: 55, alpha: 0.6, color: Math.random() > 0.5 ? 0 : 1 })
    }
    e.beat    = lerp(e.beat, 0, 0.1)
    e.beatAge = (e.beatAge ?? 0) + 1

    const [r1, g1, b1] = hexToRgb(primaryColor)
    const [r2, g2, b2] = hexToRgb(secondaryColor)

    // ── Fondo — fade suave ─────────────────────────────────────────────────
    ctx.fillStyle = `rgba(7,7,14,${isPlaying ? 0.18 : 0.35})`
    ctx.fillRect(0, 0, W, H)

    // ── Glow central ───────────────────────────────────────────────────────
    const glowR = 80 + e.bass * 180 + e.beat * 80
    const grd   = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grd.addColorStop(0,   `rgba(${r1},${g1},${b1},${0.06 + e.bass * 0.14})`)
    grd.addColorStop(0.5, `rgba(${r2},${g2},${b2},${0.02 + e.mid  * 0.06})`)
    grd.addColorStop(1,   'rgba(7,7,14,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)

    // ── Anillos de pulso (beat) ─────────────────────────────────────────────
    const rings = ringsRef.current
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i]
      ring.r     += 3.5
      ring.alpha *= 0.93
      if (ring.alpha < 0.01) { rings.splice(i, 1); continue }
      const [rr, rg, rb] = ring.color === 0 ? [r1, g1, b1] : [r2, g2, b2]
      ctx.beginPath()
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${ring.alpha})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // ── Barras de frecuencia radiales ──────────────────────────────────────
    const BAR_COUNT  = N
    const BASE_R     = 52
    const MAX_H      = Math.min(W, H) * 0.18
    const angleStep  = (Math.PI * 2) / BAR_COUNT

    if (isPlaying || e.bass > 0.01) {
      for (let i = 0; i < BAR_COUNT; i++) {
        const freqIdx  = Math.floor((i / BAR_COUNT) * (buf.length * 0.75))
        const rawFreq  = (buf[freqIdx] ?? 0) / 255
        const freq     = isPlaying ? rawFreq : rawFreq * 0.05

        if (freq < 0.01) continue

        const angle   = i * angleStep - Math.PI / 2
        const barH    = freq * MAX_H
        const x1      = cx + Math.cos(angle) * BASE_R
        const y1      = cy + Math.sin(angle) * BASE_R
        const x2      = cx + Math.cos(angle) * (BASE_R + barH)
        const y2      = cy + Math.sin(angle) * (BASE_R + barH)

        // Color interpolado entre primary y secondary según posición
        const t   = i / BAR_COUNT
        const cr  = Math.round(lerp(r1, r2, t))
        const cg  = Math.round(lerp(g1, g2, t))
        const cb  = Math.round(lerp(b1, b2, t))
        const a   = 0.25 + freq * 0.65

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${a})`
        ctx.lineWidth   = 1.5
        ctx.lineCap     = 'round'
        ctx.stroke()
      }
    }

    // ── Círculo base suave ─────────────────────────────────────────────────
    ctx.beginPath()
    ctx.arc(cx, cy, BASE_R - 1, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r1},${g1},${b1},${0.08 + e.bass * 0.1})`
    ctx.lineWidth   = 1
    ctx.stroke()

    rafRef.current = requestAnimationFrame(draw)
  }, [analyser, isPlaying, primaryColor, secondaryColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }} aria-hidden="true" />
  )
}
