'use client'

import { useEffect, useRef, useState } from 'react'

interface HlsPlayerProps {
  src: string
  title?: string
  shouldPlay?: boolean
}

export function HlsPlayer({
  src,
  title = 'Bienvenida TV',
  shouldPlay = true,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)

  // Used to ignore obsolete play() promises when open/close happens quickly.
  const playAttemptIdRef = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    playAttemptIdRef.current += 1
    const currentAttemptId = playAttemptIdRef.current

    let cleanup: (() => void) | undefined

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported()) {
          setError(true)
          return
        }
        const hls = new Hls({ enableWorker: false })
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) setError(true)
        })
        cleanup = () => hls.destroy()

        // If a new attempt started while we're setting up, don't keep stale playback.
        if (playAttemptIdRef.current !== currentAttemptId) return
      })
    }

    return () => {
      playAttemptIdRef.current += 1
      cleanup?.()
    }
  }, [src])

  // Sync playback with parent state to avoid double audio
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    playAttemptIdRef.current += 1
    const currentAttemptId = playAttemptIdRef.current

    if (!shouldPlay) {
      video.pause()
      return
    }

    const tryPlay = async () => {
      try {
        await video.play()
      } catch (err) {
        // AbortError is expected when a new load request interrupts play()
        if (err instanceof DOMException && err.name === 'AbortError') return

        if (typeof err === 'object' && err !== null) {
          const name = (err as { name?: unknown }).name
          if (name === 'AbortError') return
        }

        // Ignore other play restrictions; audio coordination is handled by the parent.
      }
    }

    // Fire and forget; invalidate if shouldPlay flips while in-flight.
    void tryPlay().finally(() => {
      if (currentAttemptId !== playAttemptIdRef.current) return
    })
  }, [shouldPlay])

  if (error) {
    return (
      <div
        className="relative w-full rounded-xl overflow-hidden bg-[var(--color-ink-800)] flex items-center justify-center"
        style={{ paddingTop: '56.25%' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--color-ink-400)]">
          <span className="text-2xl">📺</span>
          <p className="text-xs">Señal TV no disponible en este momento</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden bg-black"
      style={{ paddingTop: '56.25%' }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        controls
        muted
        playsInline
        title={title}
      />
    </div>
  )
}
