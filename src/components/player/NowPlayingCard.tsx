'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ZenoEmbed } from './ZenoEmbed'

// ── Canvas circular bars ──────────────────────────────────────────────────────
const CV = 220   // canvas size
const LR = 65    // logo radius (130px / 2)
const NB = 52    // number of bars

function CircularBars({ isPlaying, primary, secondary }: {
  isPlaying: boolean; primary: string; secondary: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const bars = useMemo(() => Array.from({ length: NB }, () => ({
    cur: 8, tgt: 8 + Math.random() * 22,
    spd: 0.06 + Math.random() * 0.10,
    alt: Math.random() > 0.8,
  })), [])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cx = CV / 2, cy = CV / 2
    let raf: number

    function draw() {
      ctx!.clearRect(0, 0, CV, CV)
      for (let i = 0; i < NB; i++) {
        const b = bars[i]
        if (isPlaying) {
          b.cur += (b.tgt - b.cur) * b.spd
          if (Math.abs(b.cur - b.tgt) < 0.8) b.tgt = 3 + Math.random() * 22
        } else {
          b.cur += (8 - b.cur) * 0.08
        }
        const angle = (i / NB) * 2 * Math.PI - Math.PI / 2
        const r0 = LR + 5
        ctx!.beginPath()
        ctx!.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0)
        ctx!.lineTo(cx + Math.cos(angle) * (r0 + b.cur), cy + Math.sin(angle) * (r0 + b.cur))
        ctx!.strokeStyle = b.alt ? secondary : primary
        ctx!.lineWidth = 2.5
        ctx!.lineCap = 'round'
        ctx!.globalAlpha = 0.9
        ctx!.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, primary, secondary, bars])

  return (
    <canvas ref={ref} width={CV} height={CV}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  )
}

const AMBER  = '#db8918'
const CYAN   = '#40B9BF'
const PURPLE = '#7D59B5'

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

const EQ_H = [14,22,32,18,28,36,24,16,30,20,34,14,26,36,18,32,22,28,16,36,24,18,30,14,28,36,20,24,16,32,18,26]

export function NowPlayingCard({
  radio, nowPlaying, isPlaying, isLoading, hasError,
  volume, onToggle, onVolumeChange,
}: Props) {
  const showZeno    = hasError && !!radio.zenoSlug
  const hasRealSong = !!(
    nowPlaying.title && nowPlaying.title !== 'En Vivo' &&
    nowPlaying.artist && nowPlaying.artist !== radio.name &&
    nowPlaying.artist !== `${radio.name} ${radio.frequency}`
  )
  const ac       = useAlbumColors(nowPlaying.albumArt)
  const primary  = hasRealSong ? ac.primary   : AMBER
  const secondary= hasRealSong ? ac.secondary : CYAN
  const glow     = hasRealSong ? ac.glow      : 'rgba(219,137,24,0.4)'
  const [freq, band] = radio.frequency.split(' ')
  const title    = hasRealSong ? nowPlaying.title  : radio.name
  const artist   = hasRealSong ? nowPlaying.artist : `${radio.city} · ${radio.country}`
  const artSrc   = hasRealSong && nowPlaying.albumArt ? nowPlaying.albumArt : '/icons/icon-512.png'

  return (
    <>
      <style>{`
        @keyframes eq-pulse { from { transform: scaleY(0.08) } to { transform: scaleY(1) } }
        @keyframes spin-slow { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{
        borderRadius: 24,
        overflow: 'hidden',
        background: `linear-gradient(170deg, #12091e 0%, #07070e 55%)`,
        border: `1px solid ${primary}20`,
        boxShadow: isPlaying
          ? `0 0 0 1px ${primary}15, 0 24px 80px ${glow}, 0 8px 32px rgba(0,0,0,0.8)`
          : `0 12px 48px rgba(0,0,0,0.7)`,
        transition: 'box-shadow 1.5s, border-color 1.5s',
      }}>

        {/* Accent top */}
        <div style={{ height: 3, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, transparent, ${primary}, ${secondary}, ${PURPLE}, ${primary}, transparent)`,
            opacity: isPlaying ? 1 : 0.25,
            transition: 'opacity 1s',
          }} />
          {isPlaying && (
            <motion.div style={{
              position: 'absolute', top: 0, height: '100%', width: '35%',
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)',
            }}
              animate={{ left: ['-35%', '135%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            />
          )}
        </div>

        {showZeno ? (
          <div style={{ padding: 20 }}><ZenoEmbed slug={radio.zenoSlug!} /></div>
        ) : (
          <>
            {/* ── HERO: barras circulares + logo libre ────────────────────── */}
            <div style={{
              width: '100%',
              height: 240,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `radial-gradient(ellipse at 50% 50%, ${primary}14 0%, transparent 70%)`,
            }}>
              {/* Frecuencia decorativa */}
              <div style={{
                position: 'absolute', bottom: 4, right: 14,
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: 72, lineHeight: 1, letterSpacing: -2,
                color: `${primary}07`, fontWeight: 700,
                pointerEvents: 'none', userSelect: 'none',
              }}>
                {freq}
              </div>

              {/* Contenedor del visualizador — flex child, centrado por el padre */}
              <div style={{ position: 'relative', width: CV, height: CV, flexShrink: 0 }}>

                {/* Canvas barras circulares */}
                <CircularBars isPlaying={isPlaying} primary={primary} secondary={secondary} />

                {/* Glow radial detrás del logo */}
                {isPlaying && (
                  <motion.div style={{
                    position: 'absolute',
                    width: LR * 2 + 20, height: LR * 2 + 20,
                    borderRadius: '50%',
                    top: '50%', left: '50%',
                    marginTop: -(LR + 10), marginLeft: -(LR + 10),
                    background: `radial-gradient(circle, ${primary}35 0%, transparent 70%)`,
                    filter: 'blur(16px)',
                  }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Logo — centrado con margin (no transform, no conflicto) */}
                <div style={{
                  position: 'absolute',
                  width: LR * 2, height: LR * 2,
                  top: '50%', left: '50%',
                  marginTop: -LR, marginLeft: -LR,
                  borderRadius: '50%',
                  overflow: 'hidden',
                }}>
                  <motion.div style={{ width: '100%', height: '100%' }}
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                  >
                    <Image
                      src={artSrc}
                      alt={title ?? radio.name}
                      width={LR * 2} height={LR * 2}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'contain',
                        filter: isPlaying
                          ? `drop-shadow(0 0 14px ${primary}) drop-shadow(0 0 28px ${primary}60)`
                          : `drop-shadow(0 4px 12px rgba(0,0,0,0.5))`,
                        transition: 'filter 1s',
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Gradient bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 56,
                background: 'linear-gradient(to bottom, transparent, #07070e)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* ── CONTENIDO ───────────────────────────────────────────────── */}
            <div style={{ padding: '16px 20px 22px' }}>

              {/* Badge + frecuencia */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 999,
                  background: `${primary}12`, border: `1px solid ${primary}30`,
                  fontSize: 9, fontWeight: 900, letterSpacing: 2,
                  textTransform: 'uppercase', color: primary,
                }}>
                  <motion.span style={{ width: 6, height: 6, borderRadius: '50%', background: primary, display: 'inline-block' }}
                    animate={{ opacity: isPlaying ? [1, 0.15, 1] : 0.35 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  {isPlaying ? 'Transmitiendo en vivo' : 'Radio en vivo'}
                </span>
                <span style={{
                  padding: '4px 10px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 0.5,
                }}>
                  {freq} {band || 'FM'}
                </span>
              </div>

              {/* Título + artista */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={title}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
                  style={{ marginBottom: 16 }}>
                  <p className="font-display" style={{ fontSize: 30, color: '#fff', lineHeight: 1.05, letterSpacing: 0.5 }}>
                    {title}
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginTop: 4, fontWeight: 500 }}>
                    {artist}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Ecualizador full-width */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36, marginBottom: 20 }}>
                {EQ_H.map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: h,
                    borderRadius: 3,
                    background: `linear-gradient(to top, ${primary}, ${i % 3 === 0 ? PURPLE : secondary}80)`,
                    transformOrigin: 'bottom',
                    transform: isPlaying ? undefined : 'scaleY(0.12)',
                    animation: isPlaying
                      ? `eq-pulse ${0.38 + (i % 7) * 0.09}s ease-in-out infinite alternate`
                      : 'none',
                    animationDelay: `${(i * 0.05).toFixed(2)}s`,
                    opacity: 0.85,
                  }} />
                ))}
              </div>

              {/* Divisor */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 18 }} />

              {/* Controles: vol slider + play */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Vol icono */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill={primary} style={{ opacity: 0.45, flexShrink: 0 }}>
                  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                </svg>

                {/* Slider */}
                <div style={{ flex: 1, height: 40, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={e => {
                    const r = e.currentTarget.getBoundingClientRect()
                    onVolumeChange(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)))
                  }}
                >
                  <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 2,
                      width: `${volume * 100}%`,
                      background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                      transition: 'width .1s',
                    }} />
                    <div style={{
                      position: 'absolute', top: '50%',
                      left: `${volume * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#fff',
                      boxShadow: `0 0 0 3px ${primary}50, 0 2px 8px rgba(0,0,0,0.5)`,
                      transition: 'left .1s',
                    }} />
                  </div>
                </div>

                {/* Vol alto */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill={primary} style={{ opacity: 0.45, flexShrink: 0 }}>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>

                {/* Play button */}
                <motion.button
                  whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }}
                  onClick={() => { if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10,30,10]); onToggle() }}
                  disabled={isLoading}
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, ${primary}, ${primary}CC)`,
                    color: '#07070e', border: 'none', cursor: 'pointer',
                    boxShadow: isPlaying
                      ? `0 0 32px ${glow}, 0 0 64px ${glow.replace('0.4','0.12')}, 0 6px 20px rgba(0,0,0,0.4)`
                      : `0 4px 16px rgba(0,0,0,0.3)`,
                    transition: 'box-shadow .8s',
                    position: 'relative',
                  }}
                >
                  {isPlaying && (
                    <>
                      {[0, 1].map(i => (
                        <motion.span key={i} style={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          border: `1.5px solid ${primary}`, pointerEvents: 'none',
                        }}
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 2 + i * 0.6, opacity: 0 }}
                          transition={{ duration: 1.8 + i * 0.6, repeat: Infinity, delay: i * 0.9 }}
                        />
                      ))}
                    </>
                  )}
                  {isLoading
                    ? <div style={{ width: 22, height: 22, border: '2.5px solid rgba(7,7,14,.3)', borderTopColor: '#07070e', borderRadius: '50%', animation: 'spin-slow .7s linear infinite' }} />
                    : isPlaying
                      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}><path d="M8 5.14v14l11-7-11-7z"/></svg>
                  }
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
