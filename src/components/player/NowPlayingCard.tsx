'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume1, Volume2 } from 'lucide-react'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ZenoEmbed } from './ZenoEmbed'
import { BorderBeam } from '@/components/ui/effects'

const SIZE   = 260   // canvas px
const LOGO_R = 60    // radio del logo
const BAR_N  = 52    // cantidad de barras

// ── Canvas visualizador — sin CSS, coordenadas exactas ────────────────────────
function CircularViz({ isPlaying, primary, secondary }: {
  isPlaying: boolean; primary: string; secondary: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  const bars = useMemo(() =>
    Array.from({ length: BAR_N }, () => ({
      cur: 3,
      tgt: 3 + Math.random() * 22,
      spd: 0.06 + Math.random() * 0.10,
    })),
  [])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const cx = SIZE / 2
    const cy = SIZE / 2

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE)

      for (let i = 0; i < BAR_N; i++) {
        const b = bars[i]
        if (isPlaying) {
          b.cur += (b.tgt - b.cur) * b.spd
          if (Math.abs(b.cur - b.tgt) < 0.8) b.tgt = 3 + Math.random() * 22
        } else {
          b.cur += (3 - b.cur) * 0.08
        }

        const angle = (i / BAR_N) * 2 * Math.PI - Math.PI / 2
        const innerR = LOGO_R + 5
        const outerR = innerR + b.cur
        const x1 = cx + Math.cos(angle) * innerR
        const y1 = cy + Math.sin(angle) * innerR
        const x2 = cx + Math.cos(angle) * outerR
        const y2 = cy + Math.sin(angle) * outerR

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle  = i % 5 === 0 ? secondary : primary
        ctx.lineWidth    = 2.5
        ctx.lineCap      = 'round'
        ctx.globalAlpha  = 0.85
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, primary, secondary, bars])

  return (
    <canvas
      ref={ref}
      width={SIZE} height={SIZE}
      className="absolute inset-0"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface NowPlayingCardProps {
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

// ── Card principal ────────────────────────────────────────────────────────────
export function NowPlayingCard({
  radio, nowPlaying, isPlaying, isLoading, hasError,
  volume, onToggle, onVolumeChange,
}: NowPlayingCardProps) {
  const showZeno    = hasError && !!radio.zenoSlug
  const hasRealSong = !!(nowPlaying.title
    && nowPlaying.title  !== 'En Vivo'
    && nowPlaying.artist && nowPlaying.artist !== radio.name
    && nowPlaying.artist !== `${radio.name} ${radio.frequency}`)

  const colors = useAlbumColors(nowPlaying.albumArt)
  const [freq, band] = radio.frequency.split(' ')
  const title  = hasRealSong ? nowPlaying.title  : radio.name
  const artist = hasRealSong ? nowPlaying.artist : `${freq} ${band || 'FM'} · ${radio.city}`
  const artSrc = hasRealSong && nowPlaying.albumArt ? nowPlaying.albumArt : '/icons/icon-512.png'

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: 'rgba(10,10,18,0.97)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.06)' }}
      animate={{ boxShadow: isPlaying ? `0 20px 60px ${colors.glow}, 0 0 100px ${colors.glow.replace('0.35','0.06')}` : '0 8px 32px rgba(0,0,0,0.6)' }}
      transition={{ duration: 1.5 }}
    >
      <AnimatePresence>
        {isPlaying && <BorderBeam colorFrom={colors.primary} colorTo={colors.secondary} duration={3} />}
      </AnimatePresence>

      <div className="flex flex-col items-center px-5 pt-6 pb-5 gap-4">
        {showZeno ? (
          <div className="w-full">
            <p className="text-xs text-center mb-2" style={{ color: colors.primary }}>Reproductor alternativo</p>
            <ZenoEmbed slug={radio.zenoSlug!} />
          </div>
        ) : (
          <>
            {/* ── VISUALIZADOR CANVAS + LOGO ───────────────────────────────── */}
            <div className="relative" style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}>

              {/* Canvas barras — perfectamente centrado */}
              <CircularViz isPlaying={isPlaying} primary={colors.primary} secondary={colors.secondary} />

              {/* Outer ring giratorio — margin negativo, sin transform conflict */}
              <div className="absolute pointer-events-none rounded-full overflow-hidden"
                style={{ width: LOGO_R*2+8, height: LOGO_R*2+8, top: '50%', left: '50%', marginTop: -(LOGO_R+4), marginLeft: -(LOGO_R+4) }}>
                <motion.div className="w-full h-full"
                  style={{ background: `conic-gradient(${colors.primary}60, ${colors.secondary}60, ${colors.primary}60)` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Logo circular — margin negativo */}
              <div className="absolute rounded-full overflow-hidden"
                style={{ width: LOGO_R*2, height: LOGO_R*2, top: '50%', left: '50%', marginTop: -LOGO_R, marginLeft: -LOGO_R, background: 'radial-gradient(circle, #1c1c2e 0%, #0a0a12 100%)' }}>
                <motion.div className="absolute inset-0"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}>
                  <Image src={artSrc} alt={title ?? radio.name} fill sizes={`${LOGO_R*2}px`}
                    className={hasRealSong && nowPlaying.albumArt ? 'object-cover' : 'object-contain p-3'} />
                </motion.div>
                {/* Vinyl hole */}
                <div className="absolute rounded-full z-10"
                  style={{ width: 10, height: 10, top: '50%', left: '50%', marginTop: -5, marginLeft: -5, background: '#0a0a12', border: `2px solid ${colors.primary}40` }} />
              </div>

              {/* Anillos de pulso — margin negativo */}
              <AnimatePresence>
                {isPlaying && [0, 1].map(i => {
                  const sz = LOGO_R*2 + 20 + i*30
                  return (
                    <motion.div key={i}
                      className="absolute rounded-full pointer-events-none"
                      style={{ width: sz, height: sz, top: '50%', left: '50%', marginTop: -sz/2, marginLeft: -sz/2, border: `1px solid ${colors.primary}` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.4, 0], scale: [1, 1.2, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2 + i*0.7, repeat: Infinity, delay: i*1, ease: 'easeOut' }}
                    />
                  )
                })}
              </AnimatePresence>
            </div>

            {/* ── INFO ─────────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={title}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="text-center w-full">
                <p className="text-white font-bold text-base leading-tight truncate px-4">{title}</p>
                <p className="text-white/40 text-xs mt-1 truncate px-4">{artist}</p>
              </motion.div>
            </AnimatePresence>

            {/* Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: `${colors.primary}12`, border: `1px solid ${colors.primary}28` }}>
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.primary }}
                animate={{ opacity: isPlaying ? [1, 0.25, 1] : 0.4 }}
                transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.primary }}>
                {isPlaying ? 'Transmitiendo en vivo' : 'Radio en vivo'}
              </span>
            </div>

            {/* Play */}
            <div className="flex justify-center">
              <PlayButton isPlaying={isPlaying} isLoading={isLoading} onToggle={onToggle} color={colors.primary} glow={colors.glow} />
            </div>

            {/* Volumen */}
            <div className="flex items-center gap-2 w-full">
              <Volume1 className="w-3.5 h-3.5 flex-shrink-0 opacity-40" style={{ color: colors.primary }} />
              <div className="flex-1 relative h-1 rounded-full cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); onVolumeChange(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))) }}>
                <motion.div className="absolute top-0 left-0 h-full rounded-full" style={{ background: colors.primary }}
                  animate={{ width: `${volume * 100}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              </div>
              <Volume2 className="w-3.5 h-3.5 flex-shrink-0 opacity-40" style={{ color: colors.primary }} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Play button ───────────────────────────────────────────────────────────────
function PlayButton({ isPlaying, isLoading, onToggle, color, glow }: {
  isPlaying: boolean; isLoading: boolean; onToggle: () => void; color: string; glow: string
}) {
  return (
    <div className="relative flex-shrink-0">
      <AnimatePresence>
        {isPlaying && [0, 1].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.9 + i*0.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 + i*0.6, repeat: Infinity, delay: i*0.9, ease: 'easeOut' }}
            style={{ border: `1.5px solid ${color}` }} />
        ))}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }}
        onClick={() => { if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10,30,10]); onToggle() }}
        disabled={isLoading}
        className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)`, color: '#07070E' }}
        animate={{ boxShadow: isPlaying ? `0 8px 40px ${glow}` : `0 4px 20px ${glow.replace('0.35','0.15')}` }}
        transition={{ duration: 0.8 }}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isLoading
          ? <div className="w-5 h-5 border-2 border-[#07070E]/30 border-t-[#07070E] rounded-full animate-spin" />
          : isPlaying
            ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
        }
      </motion.button>
    </div>
  )
}
