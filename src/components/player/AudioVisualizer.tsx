'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface AudioVisualizerProps {
  analyser: AnalyserNode | null
  isPlaying: boolean
  className?: string
  barColor?: string
  barCount?: number
}

export function AudioVisualizer({
  analyser,
  isPlaying,
  className,
  barColor = '#db8918',
  barCount = 64,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const idleRef = useRef<number[]>([])

  // Initialize idle waveform heights
  useEffect(() => {
    idleRef.current = Array.from({ length: barCount }, (_, i) => {
      const center = barCount / 2
      const dist = Math.abs(i - center) / center
      return 0.05 + (1 - dist) * 0.12 + Math.random() * 0.08
    })
  }, [barCount])

  const drawRef = useRef<() => void>(() => {})

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Trabajamos en "CSS pixels" usando el tamaño del layout
    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    ctx.clearRect(0, 0, width, height)

    const barWidth = width / barCount
    const gap = barWidth * 0.25

    // roundRect no siempre está disponible en todos los runtimes
    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ): void => {
      const anyCtx = ctx as unknown as {
        roundRect?: (
          x2: number,
          y2: number,
          w2: number,
          h2: number,
          r2: number
        ) => void
      }

      if (typeof anyCtx.roundRect === 'function') {
        anyCtx.roundRect(x, y, w, h, r)
        return
      }

      ctx.beginPath()
      ctx.rect(x, y, w, h)
    }

    if (analyser && isPlaying) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)
      const step = Math.floor(dataArray.length / barCount)

      // Detectar si iOS bloqueó el analyser (todos en cero)
      const total = dataArray.reduce((a, b) => a + b, 0)
      const iOsBlocked = total === 0

      const t = Date.now() / 1000

      for (let i = 0; i < barCount; i++) {
        let value: number

        if (iOsBlocked) {
          // Simulación animada para iOS: ondas senoidales con fase por barra
          const center = barCount / 2
          const dist = 1 - Math.abs(i - center) / center
          value = (0.15 + dist * 0.5) *
            (0.5 + 0.5 * Math.abs(Math.sin(t * 2.5 + i * 0.35))) *
            (0.7 + 0.3 * Math.sin(t * 1.1 + i * 0.15))
        } else {
          value = dataArray[i * step] / 255
        }

        const barH = Math.max(value * height, 3)
        const x = i * barWidth + gap / 2

        const gradient = ctx.createLinearGradient(x, height, x, height - barH)
        gradient.addColorStop(0, barColor)
        gradient.addColorStop(1, barColor + '88')

        ctx.fillStyle = gradient
        ctx.beginPath()
        roundRect(x, height - barH, barWidth - gap, barH, 2)
        ctx.fill()
      }
    } else {
      // Idle breathing animation
      const t = Date.now() / 1000
      for (let i = 0; i < barCount; i++) {
        const base = idleRef.current[i] ?? 0.08
        const wave = Math.sin(t * 1.5 + i * 0.3) * 0.04
        const barH = Math.max((base + wave) * height, 3)
        const x = i * barWidth + gap / 2

        ctx.fillStyle = barColor + '40'
        ctx.beginPath()
        roundRect(x, height - barH, barWidth - gap, barH, 2)
        ctx.fill()
      }
    }

    // Evita referenciar "draw" desde dentro del propio closure para que no
    // dispare el error "Cannot access variable before it is declared".
    animationRef.current = requestAnimationFrame(drawRef.current)
  }, [analyser, isPlaying, barColor, barCount])

  useEffect(() => {
    drawRef.current = draw
  }, [draw])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(drawRef.current)
    return () => cancelAnimationFrame(animationRef.current)
  }, [draw])

  // Handle canvas DPR scaling (sin "acumular" transforms)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Aseguramos que el sistema de coordenadas está basado en CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [barCount])

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full rounded-lg', className)}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  )
}
