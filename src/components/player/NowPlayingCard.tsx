'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Volume1, Volume2 } from 'lucide-react'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ZenoEmbed } from './ZenoEmbed'

// Colores corporativos Radio Bienvenida
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

// ── Ecualizador CSS puro — 0 conflictos con layout ───────────────────────────
const EQ_BARS = 32
const EQ_DURATIONS = [0.45,0.6,0.5,0.4,0.7,0.55,0.48,0.65,0.42,0.58,0.5,0.7,0.44,0.6,0.52,0.46,0.68,0.5,0.4,0.62,0.54,0.48,0.7,0.44,0.6,0.5,0.66,0.42,0.58,0.5,0.44,0.62]

function Equalizer({ isPlaying, primary }: { isPlaying: boolean; primary: string }) {
  return (
    <>
      <style>{`
        @keyframes eq { from { transform: scaleY(0.08); } to { transform: scaleY(1); } }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, height: 36 }}>
        {Array.from({ length: EQ_BARS }, (_, i) => (
          <div key={i} style={{
            width: 3,
            height: 36,
            borderRadius: 2,
            background: `linear-gradient(to top, ${primary}, ${CYAN}80)`,
            transformOrigin: 'bottom',
            transform: isPlaying ? undefined : 'scaleY(0.08)',
            animation: isPlaying ? `eq ${EQ_DURATIONS[i]}s ease-in-out infinite alternate` : 'none',
            animationDelay: isPlaying ? `${(i * 0.04).toFixed(2)}s` : '0s',
            opacity: 0.85,
          }} />
        ))}
      </div>
    </>
  )
}

// ── Card principal ────────────────────────────────────────────────────────────
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
  const albumColors = useAlbumColors(nowPlaying.albumArt)
  const [freq, band] = radio.frequency.split(' ')

  // Cuando hay metadata de álbum usa esos colores; si no, los corporativos
  const primary   = hasRealSong ? albumColors.primary   : AMBER
  const secondary = hasRealSong ? albumColors.secondary : CYAN
  const glow      = hasRealSong ? albumColors.glow      : 'rgba(219,137,24,0.35)'

  const title  = hasRealSong ? nowPlaying.title  : radio.name
  const artist = hasRealSong ? nowPlaying.artist : `${freq} ${band || 'FM'} · ${radio.city}`
  const artSrc = hasRealSong && nowPlaying.albumArt ? nowPlaying.albumArt : '/icons/icon-512.png'

  return (
    <div className="relative overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(160deg,rgba(18,12,28,0.99) 0%,rgba(7,7,14,0.99) 100%)',
        border: `1px solid ${primary}22`,
        boxShadow: isPlaying
          ? `0 0 0 1px ${primary}20, 0 20px 60px ${glow}, 0 0 120px ${glow.replace('0.35','0.06')}`
          : '0 8px 40px rgba(0,0,0,0.6)',
        transition: 'box-shadow 1.5s ease, border-color 1.5s ease',
      }}
    >
      {/* Grid decorativo de fondo */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${primary}08 1px,transparent 1px),linear-gradient(90deg,${primary}08 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Línea top animada */}
      <div className="relative h-[2px] overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(90deg,transparent,${primary},${secondary},${PURPLE},${primary},transparent)`,
          opacity: isPlaying ? 1 : 0.25,
          transition: 'opacity 1s',
        }} />
        {isPlaying && (
          <motion.div className="absolute top-0 h-full w-1/3"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)' }}
            animate={{ left: ['-33%', '133%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
          />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 24px', gap: 16 }}>

        {showZeno ? (
          <ZenoEmbed slug={radio.zenoSlug!} />
        ) : (
          <>
            {/* Frecuencia decorativa de fondo */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: -24, zIndex: 0, pointerEvents: 'none' }}>
              <span className="font-display select-none"
                style={{ fontSize: 128, lineHeight: 1, color: `${primary}07`, letterSpacing: -4 }}>
                {freq}
              </span>
            </div>

            {/* ── LOGO — en flujo flex, sin absolute para centrar ─────────── */}
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              {/* Ring giratorio con gradiente corporativo */}
              <div style={{
                padding: 3,
                borderRadius: '50%',
                background: `conic-gradient(${primary}, ${CYAN}, ${PURPLE}, ${primary})`,
                boxShadow: isPlaying ? `0 0 24px ${glow}, 0 0 48px ${glow.replace('0.35','0.12')}` : 'none',
                transition: 'box-shadow 1s',
              }}>
                {/* Imagen rotando — motion.div contenido en el ring */}
                <motion.div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden' }}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}>
                  <Image src={artSrc} alt={title ?? radio.name} width={120} height={120}
                    style={{ width: '100%', height: '100%', objectFit: hasRealSong && nowPlaying.albumArt ? 'cover' : 'contain', padding: hasRealSong && nowPlaying.albumArt ? 0 : 12 }} />
                </motion.div>
              </div>
              {/* Vinyl center dot — absolute dentro del div de tamaño conocido */}
              <div style={{
                position: 'absolute', width: 12, height: 12, borderRadius: '50%',
                top: '50%', left: '50%', marginTop: -6, marginLeft: -6,
                background: '#07070e', border: `2px solid ${primary}50`, zIndex: 10,
              }} />
            </div>

            {/* ── TÍTULO ──────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={title}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', width: '100%', zIndex: 1 }}>
                <p className="font-display text-white truncate"
                  style={{ fontSize: 26, letterSpacing: 1, lineHeight: 1.1 }}>
                  {title}
                </p>
                <p className="font-medium truncate" style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 4 }}>
                  {artist}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* ── BADGE EN VIVO ────────────────────────────────────────────── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 999,
              background: `${primary}10`, border: `1px solid ${primary}28`,
              zIndex: 1,
            }}>
              <motion.span style={{ width: 6, height: 6, borderRadius: '50%', background: primary, display: 'block' }}
                animate={{ opacity: isPlaying ? [1, 0.2, 1] : 0.4 }}
                transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="font-black uppercase"
                style={{ fontSize: 10, letterSpacing: 2, color: primary }}>
                {isPlaying ? 'Transmitiendo en vivo' : 'Radio en vivo'}
              </span>
            </div>

            {/* ── ECUALIZADOR ──────────────────────────────────────────────── */}
            <div style={{ width: '100%', zIndex: 1 }}>
              <Equalizer isPlaying={isPlaying} primary={primary} />
            </div>

            {/* ── PLAY ─────────────────────────────────────────────────────── */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <AnimatePresence>
                {isPlaying && [0, 1].map(i => (
                  <motion.div key={i}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      border: `1.5px solid ${primary}`, pointerEvents: 'none',
                    }}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2 + i * 0.6, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8 + i * 0.6, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }}
                onClick={() => { if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10,30,10]); onToggle() }}
                disabled={isLoading}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg, ${primary}, ${primary}99)`,
                  color: '#07070e', border: 'none', cursor: 'pointer',
                  boxShadow: isPlaying ? `0 0 32px ${glow}, 0 8px 24px rgba(0,0,0,0.4)` : `0 4px 16px rgba(0,0,0,0.3)`,
                  transition: 'box-shadow 0.8s',
                  position: 'relative', zIndex: 10,
                }}
              >
                {isLoading
                  ? <div style={{ width: 24, height: 24, border: '2px solid rgba(7,7,14,0.3)', borderTopColor: '#07070e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : isPlaying
                    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}><path d="M8 5.14v14l11-7-11-7z"/></svg>
                }
              </motion.button>
            </div>

            {/* ── VOLUMEN ──────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', zIndex: 1 }}>
              <Volume1 size={14} style={{ color: primary, opacity: 0.5, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative' }}
                onClick={e => {
                  const r = e.currentTarget.getBoundingClientRect()
                  onVolumeChange(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)))
                }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 2,
                  width: `${volume * 100}%`,
                  background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                  transition: 'width 0.1s',
                }} />
              </div>
              <Volume2 size={14} style={{ color: primary, opacity: 0.5, flexShrink: 0 }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
