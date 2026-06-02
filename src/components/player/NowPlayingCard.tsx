'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'

interface Props {
  radio: RadioConfig
  nowPlaying: NowPlaying
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  volume: number
  analyser: AnalyserNode | null
  onToggle: () => void
  onVolumeChange: (v: number) => void
}

const BARS = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.65, 0.45, 0.75]

export function NowPlayingCard({
  radio, nowPlaying, isPlaying, isLoading, hasError,
  volume, onToggle, onVolumeChange,
}: Props) {
  const hasRealSong = !!(
    nowPlaying.title && nowPlaying.title !== 'En Vivo' &&
    nowPlaying.artist && nowPlaying.artist !== radio.name
  )
  const [freq] = radio.frequency.split(' ')
  const title  = hasRealSong ? nowPlaying.title  : radio.name
  const artist = hasRealSong ? nowPlaying.artist : `${radio.frequency} · ${radio.city}`
  const artSrc = hasRealSong && nowPlaying.albumArt ? nowPlaying.albumArt : '/icons/icon-512.png'

  return (
    <div style={{
      borderRadius: 20,
      overflow: 'hidden',
      background: '#0d0d14',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>

      {/* Barra superior degradada */}
      <div style={{
        height: 2,
        background: isPlaying
          ? 'linear-gradient(90deg, #db8918, #7D59B5, #40B9BF)'
          : 'rgba(255,255,255,0.07)',
        transition: 'background 1s',
      }} />

      <div style={{ padding: '24px 20px 20px' }}>

        {/* Fila superior: logo + info */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 24 }}>

          {/* Imagen cuadrada */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {isPlaying && (
              <motion.div
                style={{
                  position: 'absolute', inset: -4, borderRadius: 16,
                  background: 'radial-gradient(circle, rgba(219,137,24,0.35), transparent 70%)',
                  filter: 'blur(8px)',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div style={{
              width: 88, height: 88, borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              background: '#1a1025',
            }}>
              <Image
                src={artSrc}
                alt={title ?? radio.name}
                width={88} height={88}
                style={{
                  width: '100%', height: '100%',
                  objectFit: hasRealSong && nowPlaying.albumArt ? 'cover' : 'contain',
                  padding: hasRealSong && nowPlaying.albumArt ? 0 : 12,
                }}
              />
            </div>
          </div>

          {/* Texto + badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Pill EN VIVO */}
            <div style={{ marginBottom: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 999,
                background: 'rgba(219,137,24,0.12)',
                border: '1px solid rgba(219,137,24,0.25)',
                fontSize: 9, fontWeight: 800, letterSpacing: 2,
                textTransform: 'uppercase', color: '#db8918',
              }}>
                <motion.span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#db8918', display: 'inline-block',
                }}
                  animate={{ opacity: isPlaying ? [1, 0.2, 1] : 0.3 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                {isPlaying ? 'En vivo' : 'Radio'}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={title}
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.25 }}
              >
                <p style={{
                  fontSize: 17, fontWeight: 800, color: '#fff',
                  lineHeight: 1.2, letterSpacing: 0.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {title}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 3, fontWeight: 500 }}>
                  {artist}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mini EQ horizontal */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 18, marginTop: 10 }}>
              {BARS.map((h, i) => (
                <motion.div key={i} style={{
                  width: 3, borderRadius: 2,
                  background: 'linear-gradient(to top, #db8918, #7D59B5)',
                  transformOrigin: 'bottom',
                }}
                  animate={{ scaleY: isPlaying ? [h * 0.3, h, h * 0.5, h * 0.8, h * 0.3] : 0.12 }}
                  transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.06 }}
                  initial={{ height: 18 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 20 }} />

        {/* Fila controles: volumen bajo — play — volumen alto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

          {/* Icono volumen bajo */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }}>
            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
          </svg>

          {/* Slider volumen */}
          <div style={{ flex: 1, height: 36, display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
            onClick={e => {
              const r = e.currentTarget.getBoundingClientRect()
              onVolumeChange(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)))
            }}
          >
            <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 2,
                width: `${volume * 100}%`,
                background: 'linear-gradient(90deg, #db8918, #40B9BF)',
                transition: 'width .1s',
              }} />
              <div style={{
                position: 'absolute', top: '50%',
                left: `${volume * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: 12, height: 12, borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 0 0 3px rgba(219,137,24,0.4)',
                transition: 'left .1s',
              }} />
            </div>
          </div>

          {/* Icono volumen alto */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>

          {/* Botón play */}
          <motion.button
            whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.05 }}
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10, 30, 10])
              onToggle()
            }}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isPlaying
                ? 'linear-gradient(135deg, #db8918, #c27012)'
                : 'rgba(219,137,24,0.18)',
              border: isPlaying ? 'none' : '1px solid rgba(219,137,24,0.3)',
              color: isPlaying ? '#07070e' : '#db8918',
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: isPlaying ? '0 0 24px rgba(219,137,24,0.45), 0 4px 16px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.4s',
            }}
          >
            {isLoading
              ? <div style={{ width: 20, height: 20, border: '2px solid rgba(7,7,14,.3)', borderTopColor: isPlaying ? '#07070e' : '#db8918', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
              : isPlaying
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><path d="M8 5.14v14l11-7-11-7z"/></svg>
            }
          </motion.button>
        </div>

        {hasError && (
          <p style={{ textAlign: 'center', color: 'rgba(255,100,100,0.7)', fontSize: 11, marginTop: 12 }}>
            Error al conectar con el stream. Reintentando…
          </p>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
