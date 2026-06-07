'use client'

import { useEffect, useRef } from 'react'
import { paintVinylDiscCanvas } from '@/lib/animations/welcomeCanvas'

/** Vinilo canvas — mismo paint que el boot overlay. */
export function VinylDiscCanvas({
  diameter,
  rotation = 0,
  className,
}: {
  diameter: number
  rotation?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    paintVinylDiscCanvas(canvas, diameter, rotation)
  }, [diameter, rotation])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
