'use client'

import { useEffect, useState } from 'react'
import { readFrequencyData, spectrumEnergy } from '@/lib/analyserRead'

/** Escala 1–1.14 según bajos del stream (o pulso simulado si pausa). */
export function useFmBeatScale(
  isPlaying: boolean,
  analyser: AnalyserNode | null,
  active: boolean,
): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!active) {
      setScale(1)
      return
    }

    const buf = new Uint8Array(analyser?.frequencyBinCount ?? 128)
    let raf = 0

    function tick() {
      if (isPlaying) {
        const { data } = readFrequencyData(analyser, true, buf)
        const { bass, mid } = spectrumEnergy(data)
        setScale(1 + Math.min(0.14, bass * 0.16 + mid * 0.06))
      } else {
        const t = performance.now() / 1000
        setScale(1 + Math.max(0, Math.sin(t * 2.4)) * 0.035)
      }
      raf = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(raf)
  }, [active, isPlaying, analyser])

  return scale
}
