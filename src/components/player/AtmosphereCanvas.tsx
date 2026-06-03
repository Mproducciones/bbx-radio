'use client'

import { useEffect, useRef, useCallback } from 'react'
import { readFrequencyData, spectrumEnergy } from '@/lib/analyserRead'

export type AtmosphereAnchor = 'player' | 'center'

interface AtmosphereCanvasProps {
  analyser: AnalyserNode | null
  isPlaying: boolean
  primaryColor: string
  secondaryColor: string
  anchor?: AtmosphereAnchor
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.startsWith('#') ? hex : '#db8918'
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export function AtmosphereCanvas({
  analyser,
  isPlaying,
  primaryColor,
  secondaryColor,
  anchor = 'player',
}: AtmosphereCanvasProps) {
  const wrapRef   = useRef<HTMLDivElement>(null)
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
    const isMobile = W < 768
    const ambient = anchor === 'center' && isMobile

    // cy alineado con el centro del vinyl en móvil:
    // el vinyl está dentro de flex-1 centrado, debajo del header (~88px) y encima de controls (~170px)
    // estimamos el centro del vinyl en H*0.38 en móvil
    const cy =
      anchor === 'center'
        ? H * (ambient ? 0.82 : 0.5)
        : isMobile
          ? H * 0.38
          : H * 0.32
    const scale = ambient ? 0.5 : 1

    const N   = 128
    const buf = new Uint8Array(analyser?.frequencyBinCount ?? 128)
    readFrequencyData(analyser, isPlaying, buf)
    const { bass: bassRaw, mid: midRaw } = spectrumEnergy(buf)

    const e = energyRef.current
    const idlePulse = 0.12 + Math.sin(performance.now() / 2200) * 0.08
    e.bass = lerp(e.bass, isPlaying ? bassRaw : idlePulse, isPlaying ? 0.2 : 0.04)
    e.mid  = lerp(e.mid,  isPlaying ? midRaw  : idlePulse * 0.6, isPlaying ? 0.15 : 0.04)

    // Beat detection
    const now = performance.now()
    if (e.bass > 0.5 && now - beatCoolRef.current > 350) {
      beatCoolRef.current = now
      e.beat    = 1
      e.beatAge = 0
      ringsRef.current.push({ r: 55, alpha: 0.55, color: Math.random() > 0.5 ? 0 : 1 })
    }
    e.beat    = lerp(e.beat, 0, 0.1)
    e.beatAge = (e.beatAge ?? 0) + 1

    const [r1, g1, b1] = hexToRgb(primaryColor)
    const [r2, g2, b2] = hexToRgb(secondaryColor)

    // Fondo suave
    ctx.fillStyle = `rgba(7,7,14,${isPlaying ? 0.04 : 0.08})`
    ctx.fillRect(0, 0, W, H)

    // ── Glow orb grande — reemplaza el logo ────────────────────────────────
    // Tres capas de glow superpuestas para efecto volumétrico
    const glowOuter = (140 + e.bass * 220 + e.beat * 80) * scale
    const glowMid   = (70  + e.bass * 120) * scale
    const glowInner = (30  + e.bass * 60)  * scale

    // Capa exterior — muy suave, gran radio
    const grdOuter = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowOuter)
    grdOuter.addColorStop(0,   `rgba(${r1},${g1},${b1},${0.10 + e.bass * 0.14})`)
    grdOuter.addColorStop(0.4, `rgba(${r2},${g2},${b2},${0.05 + e.mid  * 0.09})`)
    grdOuter.addColorStop(1,   'rgba(7,7,14,0)')
    ctx.fillStyle = grdOuter
    ctx.fillRect(0, 0, W, H)

    // Capa media — más intensa
    const grdMid = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowMid)
    grdMid.addColorStop(0,   `rgba(${r1},${g1},${b1},${0.18 + e.bass * 0.28})`)
    grdMid.addColorStop(0.5, `rgba(${r2},${g2},${b2},${0.08 + e.mid  * 0.14})`)
    grdMid.addColorStop(1,   'rgba(7,7,14,0)')
    ctx.fillStyle = grdMid
    ctx.fillRect(0, 0, W, H)

    // Capa interior — núcleo brillante
    const grdInner = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowInner)
    grdInner.addColorStop(0,   `rgba(${r1},${g1},${b1},${0.35 + e.bass * 0.45})`)
    grdInner.addColorStop(0.6, `rgba(${r2},${g2},${b2},${0.15 + e.mid  * 0.2})`)
    grdInner.addColorStop(1,   'rgba(7,7,14,0)')
    ctx.fillStyle = grdInner
    ctx.fillRect(0, 0, W, H)

    // ── Anillos de pulso (beat) ────────────────────────────────────────────
    const rings = ringsRef.current
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i]
      ring.r     += 3.5
      ring.alpha *= 0.92
      // Clip rings al ancho de pantalla — evita que se vean "cortados" abruptamente
      const maxR = Math.max(W, H) * 0.75
      if (ring.alpha < 0.01 || ring.r > maxR) { rings.splice(i, 1); continue }
      // Fade extra cuando se acercan al borde
      const edgeFade = Math.max(0, 1 - ring.r / maxR)
      const [rr, rg, rb] = ring.color === 0 ? [r1, g1, b1] : [r2, g2, b2]
      ctx.beginPath()
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${ring.alpha * edgeFade})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // ── Barras de frecuencia radiales ─────────────────────────────────────
    const BASE_R    = 52 * scale
    const MAX_H     = Math.min(W, H) * 0.18 * scale
    const angleStep = (Math.PI * 2) / N

    if (isPlaying || e.bass > 0.02) {
      for (let i = 0; i < N; i++) {
        const freqIdx = Math.floor((i / N) * (buf.length * 0.75))
        const rawFreq = (buf[freqIdx] ?? 0) / 255
        const freq    = isPlaying ? rawFreq : rawFreq * 0.05

        if (freq < 0.01) continue

        const angle = i * angleStep - Math.PI / 2
        const barH  = freq * MAX_H
        const x1    = cx + Math.cos(angle) * BASE_R
        const y1    = cy + Math.sin(angle) * BASE_R
        const x2    = cx + Math.cos(angle) * (BASE_R + barH)
        const y2    = cy + Math.sin(angle) * (BASE_R + barH)

        const t  = i / N
        const cr = Math.round(lerp(r1, r2, t))
        const cg = Math.round(lerp(g1, g2, t))
        const cb = Math.round(lerp(b1, b2, t))
        const a  = 0.25 + freq * 0.65

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${a})`
        ctx.lineWidth   = 1.5
        ctx.lineCap     = 'round'
        ctx.stroke()
      }
    }

    // Círculo base suave
    ctx.beginPath()
    ctx.arc(cx, cy, BASE_R - 1, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r1},${g1},${b1},${0.08 + e.bass * 0.1})`
    ctx.lineWidth   = 1
    ctx.stroke()

    // Vignette inferior
    const vignetteTop = anchor === 'center' ? H * (ambient ? 0.55 : 0.72) : isMobile ? H * 0.58 : H * 0.35
    const vignetteEnd = anchor === 'center' ? (ambient ? 0.72 : isMobile ? 0.45 : 0.55) : isMobile ? 0.65 : 0.78
    const vignette = ctx.createLinearGradient(0, vignetteTop, 0, H)
    vignette.addColorStop(0, 'rgba(7,7,14,0)')
    vignette.addColorStop(0.5, `rgba(7,7,14,${anchor === 'center' ? 0.12 : isMobile ? 0.18 : 0.28})`)
    vignette.addColorStop(1, `rgba(7,7,14,${vignetteEnd})`)
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, W, H)

    rafRef.current = requestAnimationFrame(draw)
  }, [analyser, isPlaying, primaryColor, secondaryColor, anchor])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (w < 1 || h < 1) return
      canvas.width  = w
      canvas.height = h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    window.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  return (
    <div ref={wrapRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  )
}
