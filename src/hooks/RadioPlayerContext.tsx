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

function isTvPath(path: string) {
  return path.startsWith('/tv')
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
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const graphReadyRef = useRef(false)
  /** Web Audio solo tras gesto del usuario — evita warnings en consola */
  const gestureUnlockedRef = useRef(false)

  const wantsPlayRef = useRef(true)
  const userPausedRef = useRef(false)
  const pausedForTvRef = useRef(false)

  const initAudioGraph = useCallback(() => {
    const audio = audioRef.current
    if (!audio || graphReadyRef.current) return
    graphReadyRef.current = true

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx({ latencyHint: 'interactive' })
    ctxRef.current = ctx

    const source = ctx.createMediaElementSource(audio)
    const node = ctx.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.55
    node.minDecibels = -90
    node.maxDecibels = -10
    source.connect(node)
    node.connect(ctx.destination)
    setAnalyser(node)
  }, [])

  const resumeContextIfNeeded = useCallback(async () => {
    if (!gestureUnlockedRef.current) return
    initAudioGraph()
    const ctx = ctxRef.current
    if (ctx?.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        /* autoplay policy */
      }
    }
  }, [initAudioGraph])

  const unlockFromGesture = useCallback(() => {
    if (gestureUnlockedRef.current) return
    gestureUnlockedRef.current = true
    void resumeContextIfNeeded()
  }, [resumeContextIfNeeded])

  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) return
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

  const shouldAutoPlay = useCallback(() => {
    return wantsPlayRef.current
      && !userPausedRef.current
      && !isTvPath(pathnameRef.current)
      && !pausedForTvRef.current
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !shouldAutoPlay()) return

    userPausedRef.current = false
    wantsPlayRef.current = true
    setHasError(false)

    try {
      if (gestureUnlockedRef.current) {
        await resumeContextIfNeeded()
      }
      setIsLoading(true)
      if (audio.readyState < 2) audio.load()
      await audio.play()
      setIsPlaying(true)
      startHeartbeat()
    } catch {
      setHasError(false)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [startHeartbeat, resumeContextIfNeeded, shouldAutoPlay])

  const playRef = useRef(play)
  playRef.current = play

  const pauseStream = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    stopHeartbeat()
  }, [stopHeartbeat])

  const pause = useCallback(() => {
    userPausedRef.current = true
    wantsPlayRef.current = false
    pauseStream()
  }, [pauseStream])

  const pauseForTv = useCallback(() => {
    pausedForTvRef.current = true
    pauseStream()
  }, [pauseStream])

  const resumeAfterTv = useCallback(() => {
    pausedForTvRef.current = false
    setIsTvOpen(false)
    if (shouldAutoPlay()) void playRef.current()
  }, [shouldAutoPlay])

  const milestone = useListeningMilestone(isPlaying)

  useEffect(() => {
    const audio = new Audio(STREAM_URL)
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audio.volume = volume
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    audioRef.current = audio

    const onPlaying = () => {
      setIsPlaying(true)
      startHeartbeat()
    }
    const onPause = () => setIsPlaying(false)
    const onCanPlay = () => {
      setIsLoading(false)
      if (shouldAutoPlay()) void playRef.current()
    }

    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', () => {
      setIsPlaying(false)
      setIsLoading(false)
      setHasError(true)
      stopHeartbeat()
    })

    const onGesture = (e: Event) => {
      if ('isTrusted' in e && !(e as Event & { isTrusted: boolean }).isTrusted) return
      unlockFromGesture()
    }
    document.addEventListener('touchstart', onGesture, { passive: true })
    document.addEventListener('pointerdown', onGesture)

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      if (!gestureUnlockedRef.current) return
      if (shouldAutoPlay() && audio.paused) void playRef.current()
    }
    document.addEventListener('visibilitychange', onVisible)

    const autoplayTimer = window.setTimeout(() => {
      if (shouldAutoPlay()) void playRef.current()
    }, 1400)

    return () => {
      window.clearTimeout(autoplayTimer)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('canplay', onCanPlay)
      document.removeEventListener('touchstart', onGesture)
      document.removeEventListener('pointerdown', onGesture)
      document.removeEventListener('visibilitychange', onVisible)
      audio.pause()
      audio.src = ''
      void ctxRef.current?.close()
      ctxRef.current = null
      graphReadyRef.current = false
      gestureUnlockedRef.current = false
      stopHeartbeat()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const onTv = isTvPath(pathname)
    if (onTv) {
      pauseForTv()
    } else if (pausedForTvRef.current) {
      resumeAfterTv()
    }
  }, [pathname, pauseForTv, resumeAfterTv])

  const toggle = useCallback(() => {
    gestureUnlockedRef.current = true
    if (isPlaying) pause()
    else {
      userPausedRef.current = false
      wantsPlayRef.current = true
      void play()
    }
  }, [isPlaying, pause, play])

  const setVolume = useCallback((v: number) => setVolumeState(v), [])

  const openConcert = useCallback(() => setIsConcertMode(true), [])
  const closeConcert = useCallback(() => setIsConcertMode(false), [])

  const openTv = useCallback(() => {
    setIsTvOpen(true)
    pauseForTv()
  }, [pauseForTv])

  const closeTv = useCallback(() => {
    resumeAfterTv()
  }, [resumeAfterTv])

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
