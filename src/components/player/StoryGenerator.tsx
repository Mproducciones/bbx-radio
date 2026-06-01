'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import type { AlbumColors } from '@/hooks/useAlbumColors'

interface StoryGeneratorProps {
  radio: RadioConfig
  nowPlaying: NowPlaying
  colors: AlbumColors
}

type Phase = 'idle' | 'generating' | 'ready' | 'error'

async function generateCanvas(
  radio: RadioConfig,
  nowPlaying: NowPlaying,
  colors: AlbumColors
): Promise<Blob> {
  const SIZE = 1080
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE)
  bg.addColorStop(0, '#07070E')
  bg.addColorStop(0.5, '#0F0F1A')
  bg.addColorStop(1, '#07070E')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Top color band
  const band = ctx.createLinearGradient(0, 0, SIZE, 0)
  band.addColorStop(0, colors.primary + '00')
  band.addColorStop(0.5, colors.primary + 'CC')
  band.addColorStop(1, colors.secondary + '00')
  ctx.fillStyle = band
  ctx.fillRect(0, 0, SIZE, 6)

  // Ambient glow circle
  const glow = ctx.createRadialGradient(SIZE / 2, SIZE * 0.35, 0, SIZE / 2, SIZE * 0.35, SIZE * 0.55)
  glow.addColorStop(0, colors.primary + '22')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Radio name (top center)
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.primary
  ctx.font = `bold 36px "Arial", sans-serif`
  ctx.letterSpacing = '8px'
  ctx.fillText(radio.frequency.toUpperCase(), SIZE / 2, 90)

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = `28px "Arial", sans-serif`
  ctx.letterSpacing = '2px'
  ctx.fillText(radio.name.toUpperCase(), SIZE / 2, 136)

  // Album art circle placeholder or image
  const cx = SIZE / 2
  const cy = SIZE * 0.42
  const r = 220

  if (nowPlaying.albumArt) {
    try {
      const img = await loadImage(nowPlaying.albumArt)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2)
      ctx.restore()
    } catch {
      drawAlbumPlaceholder(ctx, cx, cy, r, colors)
    }
  } else {
    drawAlbumPlaceholder(ctx, cx, cy, r, colors)
  }

  // Circle border
  ctx.beginPath()
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2)
  ctx.strokeStyle = colors.primary + '88'
  ctx.lineWidth = 3
  ctx.stroke()

  // Live badge
  const badgeX = cx + r * 0.6
  const badgeY = cy - r * 0.65
  ctx.fillStyle = '#FF006E'
  roundRect(ctx, badgeX - 56, badgeY - 18, 112, 36, 18)
  ctx.fill()
  ctx.fillStyle = 'white'
  ctx.font = `bold 22px "Arial", sans-serif`
  ctx.letterSpacing = '3px'
  ctx.textAlign = 'center'
  ctx.fillText('EN VIVO', badgeX, badgeY + 8)

  // Song title
  ctx.textAlign = 'center'
  ctx.fillStyle = 'white'
  ctx.font = `bold 68px "Arial", sans-serif`
  ctx.letterSpacing = '0px'
  const titleY = SIZE * 0.72
  wrapText(ctx, nowPlaying.title, SIZE / 2, titleY, SIZE - 80, 78)

  // Artist name
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = `40px "Arial", sans-serif`
  ctx.letterSpacing = '1px'
  ctx.fillText(nowPlaying.artist, SIZE / 2, SIZE * 0.83)

  // Audio wave decoration
  drawWave(ctx, SIZE / 2, SIZE * 0.9, 320, colors.primary)

  // Bottom branding
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.font = `24px "Arial", sans-serif`
  ctx.letterSpacing = '0px'
  ctx.fillText('Escuchá en vivo · Descargá la app', SIZE / 2, SIZE * 0.97)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('blob null')), 'image/png', 0.95)
  })
}

function drawAlbumPlaceholder(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, colors: AlbumColors) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grad.addColorStop(0, colors.secondary + 'AA')
  grad.addColorStop(1, colors.primary + '44')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Music note
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = `${r * 0.7}px "Arial", sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('♪', cx + 10, cy + r * 0.25)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let lineY = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, lineY)
      line = word
      lineY += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, lineY)
}

function drawWave(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, color: string) {
  const bars = 32
  const barW = (width / bars) * 0.6
  const gap = width / bars
  const maxH = 28
  ctx.fillStyle = color + '77'
  for (let i = 0; i < bars; i++) {
    const x = cx - width / 2 + i * gap
    const h = maxH * (0.3 + 0.7 * Math.abs(Math.sin(i * 0.7 + 1.2)))
    const y = cy - h / 2
    const radius = barW / 2
    roundRect(ctx, x, y, barW, h, radius)
    ctx.fill()
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function StoryGenerator({ radio, nowPlaying, colors }: StoryGeneratorProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  async function generate() {
    setPhase('generating')
    try {
      const blob = await generateCanvas(radio, nowPlaying, colors)
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
      setPhase('ready')

      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 30, 10])

      // Try native share
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'pulso.png', { type: 'image/png' })] })) {
        const file = new File([blob], `${radio.name.replace(/\s/g, '_')}.png`, { type: 'image/png' })
        await navigator.share({
          files: [file],
          title: `Escuchando ${nowPlaying.title} en ${radio.name}`,
          text: `Estoy escuchando ${nowPlaying.artist} — ${nowPlaying.title} en ${radio.name} ${radio.frequency}`,
        }).catch(() => {})
      }
    } catch {
      setPhase('error')
    }
  }

  function download() {
    if (!blobUrl) return
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `${radio.name.replace(/\s/g, '_')}_story.png`
    a.click()
  }

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.button
            key="share"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.93 }}
            onClick={generate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ShareIcon className="w-3.5 h-3.5" />
            Compartir
          </motion.button>
        )}

        {phase === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8888AA]"
          >
            <div className="w-3 h-3 border border-[#FF006E] border-t-transparent rounded-full animate-spin" />
            Generando...
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={download}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #FF006E, #7B2FFF)' }}
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              Descargar
            </motion.button>
            <button onClick={() => { setBlobUrl(null); setPhase('idle') }} className="text-[#444468] text-xs hover:text-white transition-colors">✕</button>
          </motion.div>
        )}

        {phase === 'error' && (
          <motion.button
            key="retry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setPhase('idle')}
            className="text-red-400 text-xs"
          >
            Error — reintentar
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  )
}
