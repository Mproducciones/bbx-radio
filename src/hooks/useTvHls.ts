'use client'

import { useEffect, useRef, useState } from 'react'
import { RADIO_TV_HLS } from '@/lib/radioConfig'

export type TvState = 'loading' | 'playing' | 'error'

export function useTvHls(shouldPlay = true) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<TvState>('loading')
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hlsCleanup: (() => void) | undefined

    async function init() {
      if (!video) return

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = RADIO_TV_HLS
        return
      }

      try {
        const { default: Hls } = await import('hls.js')
        if (Hls.isSupported()) {
          const hls = new Hls({ lowLatencyMode: true })
          hls.loadSource(RADIO_TV_HLS)
          hls.attachMedia(video)
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) setState('error')
          })
          hlsCleanup = () => hls.destroy()
        } else {
          setState('error')
        }
      } catch {
        setState('error')
      }
    }

    void init()
    return () => hlsCleanup?.()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!shouldPlay) {
      video.pause()
      video.muted = true
      return
    }

    video.muted = muted

    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        try {
          video.muted = true
          await video.play()
          video.muted = muted
        } catch {
          /* iOS puede requerir toque en el video */
        }
      }
    }

    void tryPlay()

    return () => {
      video.pause()
      video.muted = true
    }
  }, [shouldPlay, muted])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const retry = () => {
    setState('loading')
    const video = videoRef.current
    if (!video) return
    video.load()
    void video.play().catch(() => {})
  }

  return { videoRef, state, setState, muted, toggleMute, retry }
}
