'use client'

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useListeningMilestone } from '@/hooks/useListeningMilestone'
import { MilestoneBadge } from '@/components/player/MilestoneBadge'

/** Volumen del elemento audio siempre al máximo; el usuario regula con los botones del dispositivo. */
const STREAM_VOLUME = 1

interface RadioPlayerContextValue {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  /** iOS/Safari bloqueó autoplay — el oyente debe tocar play */
  needsTapToPlay: boolean
  analyser: AnalyserNode | null
  isTvOpen: boolean
  isConcertMode: boolean
  openTv: () => void
  closeTv: () => void
  play: () => void
  pause: () => void
  toggle: () => void
  openConcert: () => void
  closeConcert: () => void
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null)

const STREAM_URL = 'https://sonicstream-puntual.grupozgh.cl/8180/bienenida'

/** Siempre null: el stream va directo al altavoz sin Web Audio (mejor calidad en móvil). */
const DIRECT_PLAYBACK_ANALYSER = null

const listenerSessionReady = { current: false }

function ensureListenerSessionCookie(): Promise<void> {
  if (listenerSessionReady.current) return Promise.resolve()
  return fetch('/api/listeners/session', { credentials: 'include' })
    .then(() => { listenerSessionReady.current = true })
    .catch(() => { listenerSessionReady.current = true })
}

function pingListener(action: 'join' | 'leave') {
  const url = action === 'join' ? '/api/listeners/join' : '/api/listeners/leave'
  const ping = () => {
    fetch(url, { method: 'POST', credentials: 'include', keepalive: true }).catch(() => {})
  }
  if (action === 'join' && !listenerSessionReady.current) {
    ensureListenerSessionCookie().then(ping)
    return
  }
  ping()
}

function isTvPath(path: string) {
  return path.startsWith('/tv')
}

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false)
  const [isTvOpen, setIsTvOpen] = useState(false)
  const [isConcertMode, setIsConcertMode] = useState(false)

  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  useEffect(() => {
    void ensureListenerSessionCookie()
  }, [])

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const wantsPlayRef = useRef(true)
  const userPausedRef = useRef(false)
  const pausedForTvRef = useRef(false)

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

    if (!audio.paused) {
      setIsPlaying(true)
      setNeedsTapToPlay(false)
      startHeartbeat()
      return
    }

    try {
      setIsLoading(true)
      if (audio.readyState < 2) audio.load()
      await audio.play()
      setIsPlaying(true)
      setNeedsTapToPlay(false)
      startHeartbeat()
    } catch {
      setHasError(false)
      setIsPlaying(false)
      setNeedsTapToPlay(true)
    } finally {
      setIsLoading(false)
    }
  }, [startHeartbeat, shouldAutoPlay])

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
    audio.preload = 'none'
    audio.volume = STREAM_VOLUME
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    audioRef.current = audio

    const onPlaying = () => {
      setIsPlaying(true)
      setNeedsTapToPlay(false)
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

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
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
      document.removeEventListener('visibilitychange', onVisible)
      audio.pause()
      audio.src = ''
      stopHeartbeat()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onTv = isTvPath(pathname)
    if (onTv) {
      pauseForTv()
    } else if (pausedForTvRef.current) {
      resumeAfterTv()
    }
  }, [pathname, pauseForTv, resumeAfterTv])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else {
      userPausedRef.current = false
      wantsPlayRef.current = true
      void play()
    }
  }, [isPlaying, pause, play])

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
    <RadioPlayerContext.Provider value={{ isPlaying, isLoading, hasError, needsTapToPlay, analyser: DIRECT_PLAYBACK_ANALYSER, isTvOpen, isConcertMode, openTv, closeTv, play, pause, toggle, openConcert, closeConcert }}>
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
