'use client'

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Hls from 'hls.js'

interface RadioPlayerContextValue {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  volume: number
  analyser: AnalyserNode | null
  isTvOpen: boolean
  openTv: () => void
  closeTv: () => void
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (v: number) => void
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null)

// Misma fuente que Bienvenida TV → misma nitidez de audio
const HLS_URL = 'https://panel.tvstream.cl:1936/8012/8012/playlist.m3u8'

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [isTvOpen, setIsTvOpen] = useState(false)

  const pathname = usePathname()
  const prevPathRef = useRef(pathname)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  // Cerrar TV al navegar fuera de "/"
  useEffect(() => {
    if (prevPathRef.current === '/' && pathname !== '/') {
      if (isTvOpen) {
        setIsTvOpen(false)
        const video = videoRef.current
        if (video) {
          video.play().catch(() => {})
          setIsPlaying(true)
        }
      }
    }
    prevPathRef.current = pathname
  }, [pathname, isTvOpen])

  // Inicializar HLS + AudioContext una sola vez al montar
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = volume

    // Web Audio para el visualizador: video → analyser → speakers
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const source = ctx.createMediaElementSource(video)
    const node = ctx.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.8
    source.connect(node)
    node.connect(ctx.destination)
    setAnalyser(node)

    // Safari / iOS tienen HLS nativo
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false, liveSyncDurationCount: 1 })
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean }) => {
        if (data.fatal) { setHasError(true); setIsPlaying(false) }
      })
      hlsRef.current = hls
    } else {
      setHasError(true)
    }

    video.addEventListener('canplay', () => setIsLoading(false))
    video.addEventListener('error', () => {
      setIsPlaying(false)
      setIsLoading(false)
      setHasError(true)
    })

    return () => {
      hlsRef.current?.destroy()
      video.pause()
      video.src = ''
      ctx.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sincronizar volumen
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume
  }, [volume])

  const play = useCallback(async () => {
    const video = videoRef.current
    const ctx = ctxRef.current
    if (!video) return
    setHasError(false)
    try {
      if (ctx?.state === 'suspended') await ctx.resume()
      setIsLoading(true)
      await video.play()
      setIsPlaying(true)
    } catch {
      setHasError(true)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const pause = useCallback(() => {
    videoRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const setVolume = useCallback((v: number) => setVolumeState(v), [])

  const openTv = useCallback(() => {
    videoRef.current?.pause()
    setIsPlaying(false)
    setIsTvOpen(true)
  }, [])

  const closeTv = useCallback(() => {
    setIsTvOpen(false)
    const video = videoRef.current
    const ctx = ctxRef.current
    if (video) {
      if (ctx?.state === 'suspended') ctx.resume()
      video.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [])

  return (
    <RadioPlayerContext.Provider value={{ isPlaying, isLoading, hasError, volume, analyser, isTvOpen, openTv, closeTv, play, pause, toggle, setVolume }}>
      {/* Video oculto: reproduce el HLS en modo solo-audio */}
      <video
        ref={videoRef}
        playsInline
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
      {children}
    </RadioPlayerContext.Provider>
  )
}

export function useRadioPlayerContext() {
  const ctx = useContext(RadioPlayerContext)
  if (!ctx) throw new Error('useRadioPlayerContext must be used within RadioPlayerProvider')
  return ctx
}
