'use client'

import { useState, useEffect } from 'react'

export interface AlbumColors {
  primary: string
  secondary: string
  glow: string
}

// Time-of-day palettes — warm morning → energetic midday → deep night
const TIME_PALETTES: AlbumColors[] = [
  { primary: '#FF6B35', secondary: '#FFB300', glow: 'rgba(255,107,53,0.35)' },  // 6-11 mañana
  { primary: '#00D4FF', secondary: '#0099CC', glow: 'rgba(0,212,255,0.30)' },  // 11-14 mediodía
  { primary: '#FF006E', secondary: '#7B2FFF', glow: 'rgba(255,0,110,0.35)' },  // 14-18 tarde
  { primary: '#7B2FFF', secondary: '#FF006E', glow: 'rgba(123,47,255,0.35)' }, // 18-21 noche temprana
  { primary: '#4A00E0', secondary: '#2D0080', glow: 'rgba(74,0,224,0.30)' },   // 21-6 noche
]

function paletteForHour(h: number): AlbumColors {
  if (h >= 6 && h < 11) return TIME_PALETTES[0]
  if (h >= 11 && h < 14) return TIME_PALETTES[1]
  if (h >= 14 && h < 18) return TIME_PALETTES[2]
  if (h >= 18 && h < 21) return TIME_PALETTES[3]
  return TIME_PALETTES[4]
}

async function extractFromImage(url: string): Promise<AlbumColors> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 16
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, 16, 16)
        const { data } = ctx.getImageData(0, 0, 16, 16)
        let r = 0, g = 0, b = 0
        const n = data.length / 4
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i + 1]; b += data[i + 2]
        }
        r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n)
        // Boost saturation: push away from grey
        const max = Math.max(r, g, b)
        const factor = max > 0 ? 255 / max : 1
        r = Math.min(255, Math.round(r * factor * 0.9))
        g = Math.min(255, Math.round(g * factor * 0.9))
        b = Math.min(255, Math.round(b * factor))
        const primary = `rgb(${r},${g},${b})`
        // Complementary shift
        const secondary = `rgb(${b},${r},${g})`
        const glow = `rgba(${r},${g},${b},0.35)`
        resolve({ primary, secondary, glow })
      } catch {
        reject(new Error('color extraction failed'))
      }
    }
    img.onerror = reject
    img.src = url
  })
}

export function useAlbumColors(albumArtUrl?: string): AlbumColors {
  const [colors, setColors] = useState<AlbumColors>(() =>
    paletteForHour(new Date().getHours())
  )

  useEffect(() => {
    if (albumArtUrl) {
      extractFromImage(albumArtUrl)
        .then(setColors)
        .catch(() => setColors(paletteForHour(new Date().getHours())))
    } else {
      setColors(paletteForHour(new Date().getHours()))
    }
  }, [albumArtUrl])

  // Cycle palette every 30 min when no album art (creates living feel)
  useEffect(() => {
    if (albumArtUrl) return
    const interval = setInterval(() => {
      setColors(paletteForHour(new Date().getHours()))
    }, 1_800_000)
    return () => clearInterval(interval)
  }, [albumArtUrl])

  return colors
}
