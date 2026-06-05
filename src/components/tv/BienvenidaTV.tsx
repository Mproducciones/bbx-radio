'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { Maximize2, Volume2, VolumeX, X } from 'lucide-react'
import { RADIO } from '@/lib/radioConfig'
import { useTvHls } from '@/hooks/useTvHls'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { FEATURES } from '@/lib/plan'

interface BienvenidaTVProps {
  variant?: 'embedded' | 'overlay'
  shouldPlay?: boolean
  onClose?: () => void
}

export function BienvenidaTV({
  variant = 'embedded',
  shouldPlay = true,
  onClose,
}: BienvenidaTVProps) {
  const isOverlay = variant === 'overlay'
  const { isTvOpen } = useRadioPlayerContext()
  const tvShouldPlay = isOverlay ? isTvOpen : shouldPlay
  const { videoRef, state, setState, muted, toggleMute, retry } = useTvHls(tvShouldPlay)

  const enterFullscreen = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const v = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void
      webkitSetPresentationMode?: (mode: string) => void
    }

    if (typeof v.webkitEnterFullscreen === 'function') {
      v.webkitEnterFullscreen()
      return
    }
    if (typeof v.webkitSetPresentationMode === 'function') {
      v.webkitSetPresentationMode('fullscreen')
      return
    }
    if (video.requestFullscreen) {
      void video.requestFullscreen()
    } else if (document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen()
    }
  }, [videoRef])

  return (
    <div className={`tv-player tv-player--${variant} flex flex-col min-h-0`}>
      <div className="tv-player__chrome shrink-0">
        <div className="tv-player__live">
          <span className="tv-player__live-dot" aria-hidden />
          <span>En vivo</span>
        </div>

        <div className="tv-player__actions">
          <button
            type="button"
            onClick={toggleMute}
            className="tv-player__btn"
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-[18px] h-[18px]" /> : <Volume2 className="w-[18px] h-[18px]" />}
          </button>
          <button
            type="button"
            onClick={enterFullscreen}
            className="tv-player__btn tv-player__btn--accent"
            aria-label="Pantalla completa"
          >
            <Maximize2 className="w-[18px] h-[18px]" />
            <span className="tv-player__btn-label">Pantalla completa</span>
          </button>
          {isOverlay && onClose && (
            <button type="button" onClick={onClose} className="tv-player__btn" aria-label="Cerrar TV">
              <X className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      </div>

      <div
        className="tv-player__stage relative flex items-center justify-center min-h-0 w-full"
        onClick={() => {
          const v = videoRef.current
          if (!v || state === 'playing') return
          void v.play().catch(() => {})
        }}
      >
        {state === 'loading' && (
          <div className="tv-player__overlay-msg">
            <div className="w-8 h-8 border-2 border-white/15 border-t-white rounded-full animate-spin" aria-hidden />
            <p>Conectando señal...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="tv-player__overlay-msg">
            <span className="text-3xl" aria-hidden>📡</span>
            <p className="font-semibold">Señal no disponible</p>
            <p className="tv-player__overlay-sub">La transmisión no está activa en este momento</p>
            <button type="button" onClick={retry} className="tv-player__retry">
              Reintentar
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          className="tv-player__video"
          autoPlay
          playsInline
          controls={false}
          onPlaying={() => setState('playing')}
          onError={() => setState('error')}
          onWaiting={() => setState('loading')}
          style={{ display: state === 'error' ? 'none' : 'block' }}
        />
      </div>

      <div className="tv-player__footer shrink-0">
        <div className="min-w-0 flex-1">
          <p className="tv-player__title">{RADIO.name} TV</p>
          <p className="tv-player__sub">Señal en vivo · {RADIO.city}</p>
        </div>
        {FEATURES.publicidad && (
          <Link href="/anunciate" onClick={onClose} className="tv-player__ads-link shrink-0">
            Publicidad
          </Link>
        )}
      </div>
    </div>
  )
}
