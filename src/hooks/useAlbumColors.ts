'use client'

import { useState, useEffect } from 'react'

export interface AlbumColors {
  primary: string
  secondary: string
  glow: string
}

// Paletas basadas en los colores corporativos de Radio Bienvenida
// Primary: #db8918 amber · Secondary: #40B9BF teal · Tertiary: #7D59B5 purple
const TIME_PALETTES: AlbumColors[] = [
  { primary: '#FF8C42', secondary: '#db8918', glow: 'rgba(255,140,66,0.35)' },   // 6-11 mañana — naranja cálido
  { primary: '#40B9BF', secondary: '#db8918', glow: 'rgba(64,185,191,0.30)' },   // 11-14 mediodía — teal corporativo
  { primary: '#db8918', secondary: '#7D59B5', glow: 'rgba(219,137,24,0.35)' },   // 14-18 tarde — amber corporativo
  { primary: '#7D59B5', secondary: '#40B9BF', glow: 'rgba(125,89,181,0.35)' },   // 18-21 noche temprana — purple corporativo
  { primary: '#2E3A6E', secondary: '#40B9BF', glow: 'rgba(46,58,110,0.28)' },    // 21-6 noche — azul profundo
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
        const max = Math.max(r, g, b)
        const factor = max > 0 ? 255 / max : 1
        r = Math.min(255, Math.round(r * factor * 0.9))
        g = Math.min(255, Math.round(g * factor * 0.9))
        b = Math.min(255, Math.round(b * factor))
        const primary = `rgb(${r},${g},${b})`
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
  const [colors, setColors] = useState<AlbumColors>(() => paletteForHour(new Date().getHours()))

  useEffect(() => {
    if (albumArtUrl) {
      extractFromImage(albumArtUrl)
        .then(setColors)
        .catch(() => setColors(paletteForHour(new Date().getHours())))
    } else {
      setColors(paletteForHour(new Date().getHours()))
    }
  }, [albumArtUrl])

  useEffect(() => {
    if (albumArtUrl) return
    const interval = setInterval(() => setColors(paletteForHour(new Date().getHours())), 1_800_000)
    return () => clearInterval(interval)
  }, [albumArtUrl])

  return colors
}
