'use client'

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useListeningMilestone } from '@/hooks/useListeningMilestone'
import { MilestoneBadge } from '@/components/player/MilestoneBadge'

interface RadioPlayerContextValue {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  volume: number
  analyser: AnalyserNode | null
  isTvOpen: boolean
  isConcertMode: boolean
  openTv: () => void
  closeTv: () => void
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (v: number) => void
  openConcert: () => void
  closeConcert: () => void
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null)

const STREAM_URL = 'https://sonicstream-puntual.grupozgh.cl/8180/bienenida'

function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') return Math.random().toString(36).slice(2)
  let id = sessionStorage.getItem('pulso_session')
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    sessionStorage.setItem('pulso_session', id)
  }
  return id
}

function pingListener(action: 'join' | 'leave') {
  const sessionId = getSessionId()
  const url = action === 'join' ? '/api/listeners/join' : '/api/listeners/leave'
  const body = JSON.stringify({ sessionId })
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
  }
}

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [isTvOpen, setIsTvOpen] = useState(false)
  const [isConcertMode, setIsConcertMode] = useState(false)

  const pathname = usePathname()
  const prevPathRef = useRef(pathname)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)

  const milestone = useListeningMilestone(isPlaying)

  const startHeartbeat = useCallback(() => {
    pingListener('join')
    heartbeatRef.current = setInterval(() => pingListener('join'), 30_000)
  }, [])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
    pingListener('leave')
  }, [])

  // Cerrar TV al navegar fuera de "/"
  useEffect(() => {
    if (prevPathRef.current === '/' && pathname !== '/') {
      if (isTvOpen) {
        setIsTvOpen(false)
        const audio = audioRef.current
        if (audio) {
          audio.play().catch(() => {})
          setIsPlaying(true)
        }
      }
    }
    prevPathRef.current = pathname
  }, [pathname, isTvOpen])

  useEffect(() => {
    const audio = new Audio(STREAM_URL)
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audio.volume = volume
    audioRef.current = audio

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const source = ctx.createMediaElementSource(audio)
    const node = ctx.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.8
    source.connect(node)
    node.connect(ctx.destination)
    setAnalyser(node)

    audio.addEventListener('canplay', () => setIsLoading(false))
    audio.addEventListener('error', () => {
      setIsPlaying(false)
      setIsLoading(false)
      setHasError(true)
      stopHeartbeat()
    })

    return () => {
      audio.pause()
      audio.src = ''
      ctx.close()
      stopHeartbeat()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const play = useCallback(async () => {
    const audio = audioRef.current
    const ctx = ctxRef.current
    if (!audio) return
    setHasError(false)
    try {
      if (ctx?.state === 'suspended') await ctx.resume()
      setIsLoading(true)
      await audio.play()
      setIsPlaying(true)
      startHeartbeat()
    } catch {
      setHasError(true)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [startHeartbeat])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    stopHeartbeat()
  }, [stopHeartbeat])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const setVolume = useCallback((v: number) => setVolumeState(v), [])

  const openConcert = useCallback(() => setIsConcertMode(true), [])
  const closeConcert = useCallback(() => setIsConcertMode(false), [])

  const openTv = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    stopHeartbeat()
    setIsTvOpen(true)
  }, [stopHeartbeat])

  const closeTv = useCallback(() => {
    setIsTvOpen(false)
    const audio = audioRef.current
    const ctx = ctxRef.current
    if (audio) {
      if (ctx?.state === 'suspended') ctx.resume()
      audio.play().catch(() => {})
      setIsPlaying(true)
      startHeartbeat()
    }
  }, [startHeartbeat])

  return (
    <RadioPlayerContext.Provider value={{ isPlaying, isLoading, hasError, volume, analyser, isTvOpen, isConcertMode, openTv, closeTv, play, pause, toggle, setVolume, openConcert, closeConcert }}>
      {children}
      <MilestoneBadge milestone={milestone} />
    </RadioPlayerContext.Provider>
  )
}

export function useRadioPlayerContext() {
  const ctx = useContext(RadioPlayerContext)
  if (!ctx) throw new Error('useRadioPlayerContext must be used within RadioPlayerProvider')
  return ctx
}
