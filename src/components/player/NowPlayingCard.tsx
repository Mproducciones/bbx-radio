'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ZenoEmbed } from './ZenoEmbed'
import { usePlayerSecrets } from './easterEggs/usePlayerSecrets'
import { InteractiveLogo } from './easterEggs/InteractiveLogo'
import { WaveSnake } from './easterEggs/WaveSnake'
import { SecretHintToast } from './easterEggs/SecretHintToast'

// ── Canvas circular bars ──────────────────────────────────────────────────────
const CV = 220   // canvas size
const LR = 65    // logo radius (130px / 2)
const NB = 52    // number of bars

function CircularBars({ isPlaying, primary, secondary, analyser }: {
  isPlaying: boolean; primary: string; secondary: string; analyser: AnalyserNode | null
}) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const smooth = useRef(Array(NB).fill(8))
  const altBar = useMemo(() => Array.from({ length: NB }, () => Math.random() > 0.8), [])
  const fake   = useRef(Array.from({ length: NB }, () => ({
    cur: 8, tgt: 8 + Math.random() * 22, spd: 0.06 + Math.random() * 0.10,
  })))

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cx = CV / 2, cy = CV / 2
    let raf: number
    let freqData: Uint8Array | null = null

    if (analyser) {
      analyser.fftSize = 256
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      freqData = new Uint8Array(analyser.frequencyBinCount) as any
    }

    function draw() {
      ctx!.clearRect(0, 0, CV, CV)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (analyser && freqData && isPlaying) analyser.getByteFrequencyData(freqData as any)

      for (let i = 0; i < NB; i++) {
        let target: number
        if (analyser && freqData && isPlaying) {
          const bin = Math.floor((i / NB) * freqData.length)
          target = 6 + (freqData[bin] / 255) * 42
        } else if (isPlaying) {
          const f = fake.current[i]
          f.cur += (f.tgt - f.cur) * f.spd
          if (Math.abs(f.cur - f.tgt) < 0.8) f.tgt = 8 + Math.random() * 22
          target = f.cur
        } else {
          target = 8
        }

        smooth.current[i] += (target - smooth.current[i]) * 0.25
        const len = smooth.current[i]
        const angle = (i / NB) * 2 * Math.PI - Math.PI / 2
        const r0 = LR + 5
        ctx!.beginPath()
        ctx!.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0)
        ctx!.lineTo(cx + Math.cos(angle) * (r0 + len), cy + Math.sin(angle) * (r0 + len))
        ctx!.strokeStyle = altBar[i] ? secondary : primary
        ctx!.lineWidth = 2.5
        ctx!.lineCap = 'round'
        ctx!.globalAlpha = 0.9
        ctx!.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, primary, secondary, analyser, altBar])

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

// ── Waveform oscilloscope — reemplaza las barras típicas ─────────────────────
function Waveform({ analyser, isPlaying, primary, secondary }: {
  analyser: AnalyserNode | null; isPlaying: boolean; primary: string; secondary: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    let timeDomain: Uint8Array | null = null
    if (analyser) {
      analyser.fftSize = 1024
      timeDomain = new Uint8Array(analyser.fftSize)
    }
    // fallback sine when no analyser
    let t = 0

    function draw() {
      const W = canvas!.offsetWidth * (window.devicePixelRatio || 1)
      const H = canvas!.offsetHeight * (window.devicePixelRatio || 1)
      if (canvas!.width !== W) canvas!.width = W
      if (canvas!.height !== H) canvas!.height = H
      ctx!.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const grad = ctx!.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0, `${primary}00`)
      grad.addColorStop(0.2, primary)
      grad.addColorStop(0.5, secondary)
      grad.addColorStop(0.8, primary)
      grad.addColorStop(1, `${primary}00`)

      ctx!.beginPath()
      ctx!.strokeStyle = grad
      ctx!.lineWidth = 2
      ctx!.lineCap = 'round'
      ctx!.lineJoin = 'round'
      ctx!.shadowBlur = 8
      ctx!.shadowColor = primary

      const pts = 120
      for (let i = 0; i <= pts; i++) {
        const x = (i / pts) * W
        let y: number
        if (analyser && timeDomain && isPlaying) {
          analyser.getByteTimeDomainData(timeDomain as Uint8Array<ArrayBuffer>)
          const idx = Math.floor((i / pts) * timeDomain.length)
          y = cy + ((timeDomain[idx] - 128) / 128) * (H * 0.4)
        } else {
          // idle: tiny sine
          t += 0.002
          y = cy + Math.sin(i * 0.18 + t * 3 + i * 0.04) * (H * 0.08)
        }
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)
      }
      ctx!.stroke()
      ctx!.shadowBlur = 0
      t += 0.012
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [analyser, isPlaying, primary, secondary])

  return (
    <canvas ref={ref} style={{ width: '100%', height: 40, display: 'block' }} />
  )
}

export function NowPlayingCard({
  radio, nowPlaying, isPlaying, isLoading, hasError,
  volume, analyser, onToggle, onVolumeChange,
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
  const artist   = hasRealSong ? nowPlaying.artist : radio.slogan
  const artSrc   = hasRealSong && nowPlaying.albumArt ? nowPlaying.albumArt : '/icons/icon-512.png'

  const secrets = usePlayerSecrets()

  return (
    <>
      <style>{`
        @keyframes eq-pulse { from { transform: scaleY(0.08) } to { transform: scaleY(1) } }
        @keyframes spin-slow { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(170deg, #12091e 0%, #07070e 55%)`,
        border: `1px solid ${secrets.logoDigital || secrets.snakeActive ? `${primary}50` : `${primary}20`}`,
        boxShadow: isPlaying
          ? `0 0 0 1px ${primary}15, 0 24px 80px ${glow}, 0 8px 32px rgba(0,0,0,0.8)`
          : `0 12px 48px rgba(0,0,0,0.7)`,
        transition: 'box-shadow 1.5s, border-color 1.5s',
      }}>
        <SecretHintToast message={secrets.hintFlash} />

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
            }}>
              {/* fondo.png — CSS directo (evita 400 de /_next/image en Vercel) */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: 'url(/icons/fondo.png)',
                  opacity: secrets.logoDigital ? 0.08 : 0.18,
                }}
              />
              {/* Overlay oscuro encima del fondo */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 50% 50%, ${primary}18 0%, rgba(7,7,14,0.6) 70%)`,
              }} />
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
                <CircularBars isPlaying={isPlaying} primary={primary} secondary={secondary} analyser={analyser} />

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

                <InteractiveLogo
                  artSrc={artSrc}
                  title={title ?? radio.name}
                  isPlaying={isPlaying}
                  primary={primary}
                  logoDigital={secrets.logoDigital}
                  logoHold={secrets.logoHold}
                  onHoldStart={secrets.startLogoHold}
                  onHoldEnd={secrets.clearLogoHold}
                  onTap={secrets.onLogoTap}
                />
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

              {/* Título + artista / slogan */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={hasRealSong ? `${title}-${artist}` : title}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
                  style={{ marginBottom: 16 }}>
                  <p className="font-display" style={{ fontSize: 30, color: '#fff', lineHeight: 1.05, letterSpacing: 0.5 }}>
                    {title}
                  </p>
                  {artist && (
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginTop: 4, fontWeight: 500 }}>
                      {artist}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Onda / Snake FM (easter egg) */}
              <div
                style={{ marginBottom: 20, position: 'relative' }}
                onPointerDown={() => secrets.startWaveHold()}
                onPointerUp={secrets.clearWaveHold}
                onPointerLeave={secrets.clearWaveHold}
                onClick={() => secrets.onWaveTap()}
              >
                {secrets.waveHold > 0 && !secrets.snakeActive && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none z-10"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${secondary}25, transparent)`,
                      opacity: secrets.waveHold,
                    }}
                  />
                )}
                {secrets.snakeActive ? (
                  <WaveSnake
                    active
                    isPlaying={isPlaying}
                    analyser={analyser}
                    primary={primary}
                    secondary={secondary}
                    onScore={secrets.setSnakeScore}
                    onExit={secrets.exitSnake}
                  />
                ) : (
                  <Waveform analyser={analyser} isPlaying={isPlaying} primary={primary} secondary={secondary} />
                )}
                {secrets.snakeActive && secrets.snakeScore > 0 && (
                  <span
                    className="absolute top-2 left-2 text-[10px] font-black tabular-nums z-10"
                    style={{ color: primary }}
                  >
                    ♪ {secrets.snakeScore}
                  </span>
                )}
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
