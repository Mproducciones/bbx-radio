'use client'

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

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

const STREAM_URL = 'https://sonicstream-puntual.grupozgh.cl/8180/bienenida'

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const pathname = usePathname()
  const [isTvOpen, setIsTvOpen] = useState(false)
  const prevPathRef = useRef(pathname)

  // Al navegar a otra página que no sea "/", cerrar TV automáticamente
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

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Inicializar audio una vez (SIN AudioContext para evitar pérdida de estéreo/volumen)
  useEffect(() => {
    const audio = new Audio(STREAM_URL)
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audio.volume = volume
    audioRef.current = audio

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const source = ctx.createMediaElementSource(audio)
    const node = ctx.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.8
    // audio → analyser → speakers
    source.connect(node)
    node.connect(ctx.destination)
    analyserRef.current = node
    setAnalyser(node)

    audio.addEventListener('canplay', () => setIsLoading(false))
    audio.addEventListener('error', () => {
      setIsPlaying(false)
      setIsLoading(false)
      setHasError(true)
    })

    return () => {
      audio.pause()
      audio.src = ''
      ctx.close()
    }
  }, [])

  // Sincronizar volumen
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
    } catch {
      setHasError(true)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
  }, [])

  const openTv = useCallback(() => {
    // Al abrir TV, pausamos el audio
    audioRef.current?.pause()
    setIsPlaying(false)
    setIsTvOpen(true)
  }, [])

  const closeTv = useCallback(() => {
    setIsTvOpen(false)
    // Al cerrar TV, reanudamos el audio
    const audio = audioRef.current
    const ctx = ctxRef.current
    if (audio) {
      if (ctx?.state === 'suspended') ctx.resume()
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [])

  return (
    <RadioPlayerContext.Provider value={{ isPlaying, isLoading, hasError, volume, analyser, isTvOpen, openTv, closeTv, play, pause, toggle, setVolume }}>
      {children}
    </RadioPlayerContext.Provider>
  )
}

export function useRadioPlayerContext() {
  const ctx = useContext(RadioPlayerContext)
  if (!ctx) throw new Error('useRadioPlayerContext must be used within RadioPlayerProvider')
  return ctx
}
