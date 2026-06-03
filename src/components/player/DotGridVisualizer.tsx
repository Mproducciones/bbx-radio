'use client'

import { useEffect, useRef } from 'react'
import { readFrequencyData } from '@/lib/analyserRead'

/** Grilla de puntos reactiva al audio — inspirado en music-player-widget (21st). */
export function DotGridVisualizer({
  analyser,
  isPlaying,
  primary,
  secondary,
  className = '',
}: {
  analyser: AnalyserNode | null
  isPlaying: boolean
  primary: string
  secondary: string
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const cols = 18
  const rows = 14

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const freq = new Uint8Array(analyser?.frequencyBinCount ?? 128)

    function draw() {
      const dpr = window.devicePixelRatio || 1
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      if (w < 1 || h < 1) {
        raf = requestAnimationFrame(draw)
        return
      }
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, w, h)

      readFrequencyData(analyser, isPlaying, freq)

      const gapX = w / (cols + 1)
      const gapY = h / (rows + 1)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const bin = Math.floor(((col / cols) * 0.7 + (row / rows) * 0.3) * freq.length)
          const energy = freq[bin] / 255
          const pulse = isPlaying ? energy : 0.12 + Math.sin(Date.now() / 600 + col * 0.4 + row * 0.3) * 0.06
          const radius = 1.2 + pulse * 3.2
          const x = gapX * (col + 1)
          const y = gapY * (row + 1)
          const alt = (col + row) % 3 === 0

          ctx!.beginPath()
          ctx!.arc(x, y, radius, 0, Math.PI * 2)
          ctx!.fillStyle = alt ? secondary : primary
          ctx!.globalAlpha = 0.15 + pulse * 0.75
          ctx!.fill()
        }
      }
      ctx!.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [analyser, isPlaying, primary, secondary])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none w-full h-full ${className}`}
    />
  )
}
