'use client'

import { useState, useEffect, useRef } from 'react'

export interface Track {
  title:  string
  artist: string
  playedAt: string // ISO timestamp
}

export interface NowPlayingState {
  current: Track | null
  history: Track[]
}

const POLL_MS = 20_000

export function useNowPlaying(): NowPlayingState {
  const [current, setCurrent]  = useState<Track | null>(null)
  const [history, setHistory]  = useState<Track[]>([])
  const prevRawRef = useRef<string>('')

  async function fetchMeta() {
    try {
      const res  = await fetch('/api/now-playing')
      if (!res.ok) return
      const data = await res.json()

      const track: Track = {
        title:    data.title,
        artist:   data.artist,
        playedAt: new Date().toISOString(),
      }

      // Solo actualizar si cambió la canción
      if (data.raw && data.raw !== prevRawRef.current) {
        prevRawRef.current = data.raw

        // Mover la actual al historial
        setCurrent(prev => {
          if (prev && prev.title !== 'En Vivo') {
            setHistory(h => [prev, ...h].slice(0, 20))
          }
          return track
        })
      } else if (!prevRawRef.current) {
        prevRawRef.current = data.raw ?? ''
        setCurrent(track)
      }
    } catch {}
  }

  useEffect(() => {
    fetchMeta()
    const t = setInterval(fetchMeta, POLL_MS)
    return () => clearInterval(t)
  }, [])

  return { current, history }
}
