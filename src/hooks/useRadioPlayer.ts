'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseRadioPlayerOptions {
  streamUrl: string
  onError?: (error: Error) => void
}

interface UseRadioPlayerReturn {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  volume: number
  analyser: AnalyserNode | null
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (v: number) => void
}

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

export function useRadioPlayer({
  streamUrl,
  onError,
}: UseRadioPlayerOptions): UseRadioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const initAudio = useCallback(() => {
    if (audioRef.current) return

    const audio = new Audio(streamUrl)
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audioRef.current = audio

    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    ctxRef.current = ctx

    const src = ctx.createMediaElementSource(audio)
    sourceRef.current = src

    const node = ctx.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.8
    src.connect(node)
    node.connect(ctx.destination)
    setAnalyser(node)

    audio.addEventListener('canplay', () => setIsLoading(false))
    audio.addEventListener('error', () => {
      setIsPlaying(false)
      setIsLoading(false)
      setHasError(true)
      stopHeartbeat()
      onError?.(new Error('Error al cargar el stream'))
    })
  }, [streamUrl, onError, stopHeartbeat])

  const play = useCallback(async () => {
    setHasError(false)
    initAudio()
    const audio = audioRef.current!
    const ctx = ctxRef.current!

    try {
      if (ctx.state === 'suspended') await ctx.resume()
      setIsLoading(true)
      audio.load()
      await audio.play()
      setIsPlaying(true)
      startHeartbeat()
    } catch {
      setIsPlaying(false)
      setHasError(true)
      onError?.(new Error('Reproducción bloqueada. Presiona Play nuevamente.'))
    } finally {
      setIsLoading(false)
    }
  }, [initAudio, startHeartbeat, onError])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    stopHeartbeat()
  }, [stopHeartbeat])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  useEffect(() => {
    void ensureListenerSessionCookie()
    return () => {
      audioRef.current?.pause()
      ctxRef.current?.close()
      stopHeartbeat()
    }
  }, [stopHeartbeat])

  return { isPlaying, isLoading, hasError, volume, analyser, play, pause, toggle, setVolume }
}
