'use client'

import { useCallback, useEffect, useRef } from 'react'

const COLS = 36
const ROWS = 10

type Dir = 'up' | 'down' | 'left' | 'right'

interface WaveSnakeProps {
  active: boolean
  isPlaying: boolean
  analyser: AnalyserNode | null
  primary: string
  secondary: string
  onScore: (n: number) => void
  onExit: () => void
}

export function WaveSnake({
  active,
  isPlaying,
  analyser,
  primary,
  secondary,
  onScore,
  onExit,
}: WaveSnakeProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const state = useRef({
    snake: [{ x: 4, y: 5 }],
    dir: 'right' as Dir,
    food: { x: 20, y: 5 },
    tick: 0,
    score: 0,
    waveY: Array(COLS).fill(0.5),
  })
  const touchRef = useRef({ y0: 0, at: 0 })

  const spawnFood = useCallback(() => {
    const s = state.current
    let x = 0
    let y = 0
    for (let i = 0; i < 40; i++) {
      x = 2 + Math.floor(Math.random() * (COLS - 4))
      y = 1 + Math.floor(Math.random() * (ROWS - 2))
      if (!s.snake.some(p => p.x === x && p.y === y)) break
    }
    s.food = { x, y }
  }, [])

  useEffect(() => {
    if (!active) return
    const s = state.current
    s.snake = [{ x: 4, y: 5 }]
    s.dir = 'right'
    s.score = 0
    s.tick = 0
    spawnFood()
  }, [active, spawnFood])

  useEffect(() => {
    if (!active) return

    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let lastTick = 0
    let timeDomain: Uint8Array | null = null
    if (analyser) {
      analyser.fftSize = 512
      timeDomain = new Uint8Array(analyser.fftSize)
    }

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      }
      if (map[e.key]) {
        e.preventDefault()
        const nd = map[e.key]
        const opp: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
        if (opp[nd] !== state.current.dir) state.current.dir = nd
      }
      if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)

    function step(now: number) {
      const W = canvas!.clientWidth
      const H = canvas!.clientHeight
      const dpr = window.devicePixelRatio || 1
      if (canvas!.width !== W * dpr) {
        canvas!.width = W * dpr
        canvas!.height = H * dpr
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      const cellW = W / COLS
      const cellH = H / ROWS
      const s = state.current

      // Onda de fondo desde audio
      if (analyser && timeDomain && isPlaying) {
        analyser.getByteTimeDomainData(timeDomain as Uint8Array<ArrayBuffer>)
        for (let c = 0; c < COLS; c++) {
          const idx = Math.floor((c / COLS) * timeDomain.length)
          s.waveY[c] = (timeDomain[idx] - 128) / 128
        }
      } else {
        for (let c = 0; c < COLS; c++) {
          s.waveY[c] = Math.sin(now * 0.003 + c * 0.35) * 0.35
        }
      }

      if (now - lastTick > 110) {
        lastTick = now
        s.tick++
        const head = { ...s.snake[0] }
        if (s.dir === 'right') head.x++
        if (s.dir === 'left') head.x--
        if (s.dir === 'up') head.y--
        if (s.dir === 'down') head.y++

        if (head.x < 0) head.x = COLS - 1
        if (head.x >= COLS) head.x = 0
        if (head.y < 0) head.y = ROWS - 1
        if (head.y >= ROWS) head.y = 0

        // La cabeza se siente atraída por la onda de audio
        const waveRow = Math.round((1 - (s.waveY[head.x] + 1) / 2) * (ROWS - 1))
        if (s.dir === 'right' || s.dir === 'left') {
          if (head.y < waveRow) head.y++
          else if (head.y > waveRow) head.y--
        }

        s.snake.unshift(head)
        if (head.x === s.food.x && head.y === s.food.y) {
          s.score++
          onScore(s.score)
          if (navigator.vibrate) navigator.vibrate(12)
          spawnFood()
        } else {
          s.snake.pop()
        }

        if (s.snake.length > 4) {
          for (let i = 1; i < s.snake.length; i++) {
            if (s.snake[i].x === head.x && s.snake[i].y === head.y) {
              s.snake = [{ x: 4, y: 5 }]
              s.dir = 'right'
              s.score = 0
              onScore(0)
              spawnFood()
              break
            }
          }
        }
      }

      ctx!.fillStyle = 'rgba(7,7,14,0.92)'
      ctx!.fillRect(0, 0, W, H)

      // Onda (la "pista" del snake)
      ctx!.beginPath()
      ctx!.strokeStyle = `${secondary}55`
      ctx!.lineWidth = 2
      for (let c = 0; c < COLS; c++) {
        const x = c * cellW + cellW / 2
        const row = (1 - (s.waveY[c] + 1) / 2) * (ROWS - 1)
        const y = row * cellH + cellH / 2
        c === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)
      }
      ctx!.stroke()

      // Comida (notas)
      const fx = s.food.x * cellW + cellW / 2
      const fy = s.food.y * cellH + cellH / 2
      ctx!.beginPath()
      ctx!.arc(fx, fy, cellW * 0.35, 0, Math.PI * 2)
      ctx!.fillStyle = primary
      ctx!.shadowBlur = 12
      ctx!.shadowColor = primary
      ctx!.fill()
      ctx!.shadowBlur = 0

      // Snake = la línea viva
      ctx!.beginPath()
      ctx!.lineCap = 'round'
      ctx!.lineJoin = 'round'
      ctx!.lineWidth = cellW * 0.55
      s.snake.forEach((p, i) => {
        const x = p.x * cellW + cellW / 2
        const y = p.y * cellH + cellH / 2
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)
      })
      const grad = ctx!.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0, secondary)
      grad.addColorStop(0.5, primary)
      grad.addColorStop(1, secondary)
      ctx!.strokeStyle = grad
      ctx!.stroke()

      // Cabeza
      const h = s.snake[0]
      ctx!.beginPath()
      ctx!.arc(h.x * cellW + cellW / 2, h.y * cellH + cellH / 2, cellW * 0.4, 0, Math.PI * 2)
      ctx!.fillStyle = '#fff'
      ctx!.fill()

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    }
  }, [active, isPlaying, analyser, primary, secondary, onScore, onExit, spawnFood])

  if (!active) return null

  return (
    <div className="relative w-full" style={{ height: 88 }}>
      <canvas
        ref={ref}
        className="w-full h-full rounded-xl touch-none"
        style={{ border: `1px solid ${primary}40`, background: '#07070e' }}
        onTouchStart={e => {
          touchRef.current = { y0: e.touches[0].clientY, at: Date.now() }
        }}
        onTouchEnd={e => {
          const dy = e.changedTouches[0].clientY - touchRef.current.y0
          if (Math.abs(dy) < 12) return
          const opp: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
          const nd: Dir = dy < 0 ? 'up' : 'down'
          if (opp[nd] !== state.current.dir) state.current.dir = nd
        }}
      />
      <button
        type="button"
        onClick={onExit}
        className="absolute top-1.5 right-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
        style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.5)' }}
      >
        Salir
      </button>
    </div>
  )
}
