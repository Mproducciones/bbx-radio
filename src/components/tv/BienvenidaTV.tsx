'use client'

import { useEffect, useRef, useState } from 'react'
import { RADIO_TV_HLS } from '@/lib/radioConfig'

type State = 'loading' | 'playing' | 'error'

export function BienvenidaTV() {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<State>('loading')
  const [muted, setMuted]   = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    async function init() {
      if (!video) return

      // iOS Safari soporta HLS nativo
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = RADIO_TV_HLS
        return
      }

      // Chrome/Android: carga hls.js dinámicamente
      try {
        const { default: Hls } = await import('hls.js')
        if (Hls.isSupported()) {
          const hls = new Hls({ lowLatencyMode: true })
          hls.loadSource(RADIO_TV_HLS)
          hls.attachMedia(video)
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) setState('error')
          })
        } else {
          setState('error')
        }
      } catch {
        setState('error')
      }
    }

    init()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-bold text-sm tracking-wide">BIENVENIDA TV</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-xs">EN VIVO</span>
          <button
            onClick={() => {
              const v = videoRef.current
              if (!v) return
              v.muted = !v.muted
              setMuted(v.muted)
            }}
            className="text-white/50 hover:text-white transition-colors p-1.5"
          >
            {muted
              ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>
              : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Video */}
      <div className="relative flex-1 flex items-center justify-center bg-black"
        style={{ minHeight: '56vw', maxHeight: '60vh' }}>

        {state === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/40 text-xs">Conectando señal...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6 text-center">
            <span className="text-4xl">📡</span>
            <p className="text-white font-semibold text-sm">Señal no disponible</p>
            <p className="text-white/40 text-xs">La transmisión de TV no está activa en este momento</p>
            <button
              onClick={() => { setState('loading'); videoRef.current?.load() }}
              className="mt-2 text-white/50 text-xs border border-white/10 rounded-lg px-4 py-2 hover:text-white transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          controls={false}
          onPlaying={() => setState('playing')}
          onError={() => setState('error')}
          onWaiting={() => setState('loading')}
          style={{ display: state === 'error' ? 'none' : 'block' }}
        />
      </div>

      {/* Info */}
      <div className="px-4 py-5 flex flex-col gap-4">
        <div>
          <p className="text-white font-bold text-base">Radio Bienvenida 93.3 FM</p>
          <p className="text-white/40 text-sm mt-0.5">Señal de televisión · Rancagua, O'Higgins</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 rounded-xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white font-bold text-sm">Radio</p>
            <p className="text-white/40 text-xs mt-0.5">93.3 FM · En vivo</p>
          </div>
          <div className="flex-1 rounded-xl p-4 text-center"
            style={{ background: 'rgba(219,137,24,0.08)', border: '1px solid rgba(219,137,24,0.2)' }}>
            <p className="text-[#db8918] font-bold text-sm">TV</p>
            <p className="text-white/40 text-xs mt-0.5">Señal digital · En vivo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
