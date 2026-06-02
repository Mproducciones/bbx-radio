'use client'

import { useEffect, useRef } from 'react'

const LANES = 3

interface BeatCatchGameProps {
  isPlaying: boolean
  analyser: AnalyserNode | null
  primary: string
  secondary: string
  onScore: (n: number) => void
  onExit: () => void
}

interface Note {
  lane: number
  y: number
}

export function BeatCatchGame({
  isPlaying,
  analyser,
  primary,
  secondary,
  onScore,
  onExit,
}: BeatCatchGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef({
    notes: [] as Note[],
    score: 0,
    combo: 0,
    lastSpawn: 0,
    bass: 0,
  })

  const hitLane = (lane: number) => {
    const s = state.current
    const canvas = canvasRef.current
    if (!canvas) return
    const H = canvas.clientHeight
    const hitY = H - 58
    const idx = s.notes.findIndex(n => n.lane === lane && n.y >= hitY - 30 && n.y <= hitY + 18)
    if (idx >= 0) {
      s.notes.splice(idx, 1)
      s.score++
      s.combo++
      onScore(s.score)
      if (navigator.vibrate) navigator.vibrate(10)
    } else {
      s.combo = 0
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let freq: Uint8Array | null = null
    if (analyser) {
      analyser.fftSize = 256
      freq = new Uint8Array(analyser.frequencyBinCount)
    }

    let raf = 0
    const s = state.current
    s.notes = []
    s.score = 0
    s.combo = 0

    function draw(now: number) {
      const W = canvas!.clientWidth
      const H = canvas!.clientHeight
      const dpr = window.devicePixelRatio || 1
      if (canvas!.width !== W * dpr) {
        canvas!.width = W * dpr
        canvas!.height = H * dpr
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      if (analyser && freq && isPlaying) {
        analyser.getByteFrequencyData(freq as Uint8Array<ArrayBuffer>)
        let bass = 0
        for (let i = 0; i < 10; i++) bass += freq[i]
        s.bass = bass / (10 * 255)
        if (s.bass > 0.5 && now - s.lastSpawn > 260) {
          s.lastSpawn = now
          s.notes.push({ lane: Math.floor(Math.random() * LANES), y: 8 })
        }
      }

      const interval = isPlaying ? 650 - s.bass * 120 : 800
      if (now - s.lastSpawn > interval) {
        s.lastSpawn = now
        s.notes.push({ lane: Math.floor(Math.random() * LANES), y: 8 })
      }

      const speed = 2.4 + s.bass
      s.notes = s.notes.map(n => ({ ...n, y: n.y + speed })).filter(n => n.y < H - 40)

      const laneW = W / LANES
      const hitY = H - 58

      ctx!.fillStyle = '#07070e'
      ctx!.fillRect(0, 0, W, H)

      for (let l = 1; l < LANES; l++) {
        ctx!.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx!.beginPath()
        ctx!.moveTo(l * laneW, 0)
        ctx!.lineTo(l * laneW, H)
        ctx!.stroke()
      }

      ctx!.fillStyle = `${primary}15`
      ctx!.fillRect(0, hitY - 8, W, 24)
      ctx!.strokeStyle = `${primary}80`
      ctx!.setLineDash([6, 4])
      ctx!.beginPath()
      ctx!.moveTo(0, hitY)
      ctx!.lineTo(W, hitY)
      ctx!.stroke()
      ctx!.setLineDash([])

      for (const n of s.notes) {
        const cx = n.lane * laneW + laneW / 2
        const r = Math.min(laneW * 0.28, 18)
        const g = ctx!.createRadialGradient(cx, n.y, 0, cx, n.y, r)
        g.addColorStop(0, primary)
        g.addColorStop(1, secondary)
        ctx!.beginPath()
        ctx!.arc(cx, n.y, r, 0, Math.PI * 2)
        ctx!.fillStyle = g
        ctx!.fill()
      }

      ctx!.fillStyle = primary
      ctx!.font = 'bold 11px system-ui'
      ctx!.fillText(`${s.score} pts`, 10, 18)
      if (s.combo > 2) {
        ctx!.fillStyle = 'rgba(255,255,255,0.45)'
        ctx!.fillText(`×${s.combo}`, 58, 18)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [analyser, isPlaying, primary, secondary, onScore])

  return (
    <div className="relative w-full" style={{ height: 152 }}>
      <canvas ref={canvasRef} className="w-full rounded-xl touch-none" style={{ height: 152, border: `1px solid ${primary}40` }} />

      <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-2">
        {Array.from({ length: LANES }, (_, lane) => lane).map(lane => (
          <button
            key={lane}
            type="button"
            onPointerDown={e => { e.preventDefault(); hitLane(lane) }}
            className="flex-1 rounded-xl font-bold text-lg active:scale-95"
            style={{
              height: 48,
              background: `linear-gradient(180deg, ${primary}40, ${primary}15)`,
              border: `1px solid ${primary}55`,
              color: '#fff',
              touchAction: 'manipulation',
            }}
          >
            ♪
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute top-2 right-2 z-10 text-[9px] font-bold uppercase px-2 py-1 rounded-md"
        style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.6)' }}
      >
        Salir
      </button>
    </div>
  )
}
