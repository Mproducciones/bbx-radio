'use client'

import { useEffect, useRef, useCallback } from 'react'

interface AtmosphereCanvasProps {
  analyser: AnalyserNode | null
  isPlaying: boolean
  primaryColor: string
  secondaryColor: string
}

interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
  layer: 0 | 1 | 2       // 0=bass 1=mid 2=treble
  hue: number
  baseRadius: number
  wobble: number
  wobbleSpeed: number
  trail: { x: number; y: number }[]
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export function AtmosphereCanvas({ analyser, isPlaying, primaryColor, secondaryColor }: AtmosphereCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const energyRef  = useRef({ bass: 0, mid: 0, treble: 0, beat: 0 })
  const beatCoolRef = useRef(0)

  // Crear partículas una sola vez
  const particlesRef = useRef<Particle[]>([])
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 60; i++) {
      const layer = i < 40 ? 0 : i < 90 ? 1 : 2
      const baseRadius = layer === 0
        ? 80  + Math.random() * 120
        : layer === 1
          ? 160 + Math.random() * 160
          : 260 + Math.random() * 200
      particlesRef.current.push({
        angle:       Math.random() * Math.PI * 2,
        radius:      baseRadius,
        baseRadius,
        speed:       (layer === 0 ? 0.003 : layer === 1 ? 0.002 : 0.0015) * (Math.random() * 0.8 + 0.6) * (Math.random() < 0.5 ? 1 : -1),
        size:        layer === 0 ? 2.5 + Math.random() * 3 : layer === 1 ? 1.5 + Math.random() * 2.5 : 0.8 + Math.random() * 1.5,
        opacity:     0.3 + Math.random() * 0.5,
        layer,
        hue:         Math.random(),
        wobble:      Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        trail:       [],
      })
    }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H * 0.42  // ligeramente arriba del centro

    // Leer frecuencias
    let bass = 0, mid = 0, treble = 0
    if (analyser && isPlaying) {
      const buf = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(buf)
      const total = buf.length
      for (let i = 0; i < Math.floor(total * 0.05); i++) bass   += buf[i]
      for (let i = Math.floor(total * 0.05); i < Math.floor(total * 0.3); i++) mid += buf[i]
      for (let i = Math.floor(total * 0.3); i < Math.floor(total * 0.7); i++) treble += buf[i]
      bass   /= (Math.floor(total * 0.05)  * 255)
      mid    /= (Math.floor(total * 0.25)  * 255)
      treble /= (Math.floor(total * 0.4)   * 255)
    }

    const e = energyRef.current
    e.bass   = lerp(e.bass,   isPlaying ? bass   : 0, isPlaying ? 0.18 : 0.04)
    e.mid    = lerp(e.mid,    isPlaying ? mid    : 0, isPlaying ? 0.12 : 0.04)
    e.treble = lerp(e.treble, isPlaying ? treble : 0, isPlaying ? 0.10 : 0.04)

    // Beat detection: bass spike
    const now = performance.now()
    if (e.bass > 0.55 && now - beatCoolRef.current > 400) {
      e.beat = 1.0
      beatCoolRef.current = now
    }
    e.beat = lerp(e.beat, 0, 0.08)

    const [r1, g1, b1] = hexToRgb(primaryColor.startsWith('#') ? primaryColor : '#db8918')
    const [r2, g2, b2] = hexToRgb(secondaryColor.startsWith('#') ? secondaryColor : '#40B9BF')

    // Fade — más transparente = trail más largo
    ctx.fillStyle = `rgba(7,7,14,${isPlaying ? 0.15 : 0.30})`
    ctx.fillRect(0, 0, W, H)

    // Glow central — respira con el bajo
    const glowR  = (140 + e.bass * 200) * (isPlaying ? 1 : 0.3)
    const beatPulse = e.beat * 120
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR + beatPulse)
    grd.addColorStop(0,   `rgba(${r1},${g1},${b1},${0.08 + e.bass * 0.18})`)
    grd.addColorStop(0.4, `rgba(${r2},${g2},${b2},${0.03 + e.mid * 0.08})`)
    grd.addColorStop(1,   'rgba(7,7,14,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)

    // Partículas
    const particles = particlesRef.current
    for (const p of particles) {
      const energy = p.layer === 0 ? e.bass : p.layer === 1 ? e.mid : e.treble
      const playEnergy = isPlaying ? 1 : 0.05

      // Actualizar ángulo y wobble
      p.angle  += p.speed * (1 + energy * 4) * lerp(0.05, 1, playEnergy)
      p.wobble += p.wobbleSpeed
      const wobbleOffset = Math.sin(p.wobble) * (8 + energy * 30)

      // Radio dinámico: se expande con energía y late con el beat
      const beatBump = p.layer === 0 ? e.beat * 40 : p.layer === 1 ? e.beat * 20 : e.beat * 10
      p.radius = lerp(p.radius, p.baseRadius + wobbleOffset + beatBump, 0.06)

      const x = cx + Math.cos(p.angle) * p.radius
      const y = cy + Math.sin(p.angle) * p.radius

      // Trail
      p.trail.push({ x, y })
      if (p.trail.length > (p.layer === 0 ? 12 : p.layer === 1 ? 8 : 5)) p.trail.shift()

      // Dibujar trail
      if (p.trail.length > 1) {
        for (let ti = 1; ti < p.trail.length; ti++) {
          const t = ti / p.trail.length
          const alpha = t * p.opacity * (0.1 + energy * 0.5) * lerp(0.05, 1, playEnergy)
          const cr = p.layer === 0 ? lerp(r1, r2, p.hue) : p.layer === 1 ? r2 : lerp(r1, r2, 1 - p.hue)
          const cg = p.layer === 0 ? lerp(g1, g2, p.hue) : p.layer === 1 ? g2 : lerp(g1, g2, 1 - p.hue)
          const cb = p.layer === 0 ? lerp(b1, b2, p.hue) : p.layer === 1 ? b2 : lerp(b1, b2, 1 - p.hue)
          ctx.beginPath()
          ctx.moveTo(p.trail[ti - 1].x, p.trail[ti - 1].y)
          ctx.lineTo(p.trail[ti].x, p.trail[ti].y)
          ctx.strokeStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${alpha})`
          ctx.lineWidth = p.size * t
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }

      // Núcleo del punto
      const alpha = p.opacity * (0.2 + energy * 0.7) * lerp(0.05, 1, playEnergy)
      const cr = p.layer === 0 ? r1 : p.layer === 1 ? r2 : lerp(r1, r2, p.hue)
      const cg = p.layer === 0 ? g1 : p.layer === 1 ? g2 : lerp(g1, g2, p.hue)
      const cb = p.layer === 0 ? b1 : p.layer === 1 ? b2 : lerp(b1, b2, p.hue)

      // Glow del punto
      const gp = ctx.createRadialGradient(x, y, 0, x, y, p.size * (2 + energy * 3))
      gp.addColorStop(0, `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${alpha})`)
      gp.addColorStop(1, `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},0)`)
      ctx.beginPath()
      ctx.arc(x, y, p.size * (1 + energy * 2), 0, Math.PI * 2)
      ctx.fillStyle = gp
      ctx.fill()
    }

    // Líneas de conexión entre partículas cercanas del mismo layer
    ctx.globalCompositeOperation = 'screen'
    for (let i = 0; i < particles.length; i += 3) {
      for (let j = i + 1; j < Math.min(i + 12, particles.length); j++) {
        if (particles[i].layer !== particles[j].layer) continue
        const pi = particles[i], pj = particles[j]
        const xi = cx + Math.cos(pi.angle) * pi.radius
        const yi = cy + Math.sin(pi.angle) * pi.radius
        const xj = cx + Math.cos(pj.angle) * pj.radius
        const yj = cy + Math.sin(pj.angle) * pj.radius
        const dist = Math.hypot(xi - xj, yi - yj)
        if (dist < 80) {
          const energy = pi.layer === 0 ? e.bass : pi.layer === 1 ? e.mid : e.treble
          const alpha = (1 - dist / 80) * 0.15 * (isPlaying ? 0.5 + energy : 0.05)
          const [lr, lg, lb] = pi.layer === 0 ? [r1, g1, b1] : [r2, g2, b2]
          ctx.beginPath()
          ctx.moveTo(xi, yi)
          ctx.lineTo(xj, yj)
          ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over'

    rafRef.current = requestAnimationFrame(draw)
  }, [analyser, isPlaying, primaryColor, secondaryColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
