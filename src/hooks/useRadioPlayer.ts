/**
 * Hook personalizado para el reproductor de radio
 * 
 * Maneja:
 * - Reproducción de audio stream
 * - Control de volumen
 * - Estado de carga y errores
 * - Visualizador de audio (AudioContext)
 * - Fallback a ZenoEmbed si el stream falla
 */

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

  const initAudio = useCallback(() => {
    if (audioRef.current) return

    const audio = new Audio(streamUrl)
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audioRef.current = audio

    // AudioContext se crea solo después de gesto del usuario (requisito móvil)
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
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
      onError?.(new Error('Error al cargar el stream'))
    })
  }, [streamUrl, onError])

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
    } catch (err) {
      // Safari iOS bloquea autoplay → mostrar error manejable
      setIsPlaying(false)
      setHasError(true)
      onError?.(new Error('Reproducción bloqueada. Presiona Play nuevamente.'))
    } finally {
      setIsLoading(false)
    }
  }, [initAudio])

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
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      ctxRef.current?.close()
    }
  }, [])

  return { isPlaying, isLoading, hasError, volume, analyser, play, pause, toggle, setVolume }
}
