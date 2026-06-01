'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { VisualizerCircular } from './VisualizerCircular'
import { ZenoEmbed } from './ZenoEmbed'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'

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

export function NowPlayingCard({
  radio, nowPlaying, isPlaying, isLoading, hasError,
  volume, analyser, onToggle, onVolumeChange,
}: NowPlayingCardProps) {
  const showZenoFallback = hasError && !!radio.zenoSlug
  const colors = useAlbumColors(nowPlaying.albumArt)

  return (
    <motion.div
      className="pulso-player-card flex flex-col gap-5 relative overflow-hidden"
      animate={{ boxShadow: isPlaying ? `0 8px 40px ${colors.glow}` : '0 4px 20px rgba(0,0,0,0.4)' }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      {/* Accent line top */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        animate={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)` }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        animate={{ background: `radial-gradient(ellipse at 50% 0%, ${colors.glow.replace('0.35', '0.08')} 0%, transparent 65%)` }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-full bg-[var(--color-ink-600)] flex items-center justify-center overflow-hidden shadow-lg relative"
            animate={{ boxShadow: isPlaying ? `0 0 20px ${colors.glow}` : '0 2px 8px rgba(0,0,0,0.4)' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <Image src="/icons/icon-512.png" alt={radio.name} fill sizes="48px" quality={100} className="object-contain" priority />
          </motion.div>
          <div>
            <p className="font-display text-xl text-white leading-none">{radio.name}</p>
            <p className="text-[var(--color-ink-300)] text-xs">{radio.city} · {radio.frequency}</p>
          </div>
        </div>

        <AnimatePresence>
          {isPlaying && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pulso-badge-live"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mag-400)]" style={{ animation: 'var(--animate-live-dot)' }} />
              EN VIVO
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Player area */}
      <AnimatePresence mode="wait" initial={false}>
        {showZenoFallback ? (
          <motion.div key="zeno" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
            <p className="text-[var(--color-amb-400)] text-xs text-center">Stream directo no disponible · Usando reproductor alternativo</p>
            <ZenoEmbed slug={radio.zenoSlug!} />
          </motion.div>
        ) : (
          <motion.div key="native" className="flex flex-col gap-4">

            {/* Visualizador + info */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <VisualizerCircular
                  analyser={analyser}
                  isPlaying={isPlaying}
                  primaryColor={colors.primary}
                  secondaryColor={colors.secondary}
                  size={120}
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={nowPlaying.title}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 min-w-0 flex flex-col gap-1"
                >
                  {nowPlaying.albumArt && (
                    <motion.div className="w-10 h-10 rounded-lg overflow-hidden mb-1" animate={{ boxShadow: isPlaying ? `0 4px 16px ${colors.glow}` : 'none' }}>
                      <Image src={nowPlaying.albumArt} alt="Album art" width={40} height={40} className="object-cover w-full h-full" />
                    </motion.div>
                  )}
                  <p className="text-white font-bold text-base truncate leading-tight">{nowPlaying.title}</p>
                  <p className="text-[var(--color-ink-300)] text-sm truncate">{nowPlaying.artist}</p>
                  {isPlaying && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium flex items-center gap-1" style={{ color: colors.primary }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: colors.primary }} />
                      EN VIVO
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-4">
              <PlayButton isPlaying={isPlaying} isLoading={isLoading} onToggle={onToggle} color={colors.primary} glow={colors.glow} />

              <div className="flex items-center gap-2 flex-1">
                <VolumeIcon className="w-4 h-4 text-[var(--color-ink-300)] flex-shrink-0" />
                <input
                  type="range" min={0} max={1} step={0.02} value={volume}
                  onChange={e => onVolumeChange(Number(e.target.value))}
                  className="flex-1 h-1 cursor-pointer"
                  style={{ accentColor: colors.primary }}
                  aria-label="Volumen"
                />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PlayButton({ isPlaying, isLoading, onToggle, color, glow }: { isPlaying: boolean; isLoading: boolean; onToggle: () => void; color: string; glow: string }) {
  function haptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10, 30, 10])
  }

  return (
    <div className="relative flex-shrink-0">
      <AnimatePresence>
        {isPlaying && [0, 1].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8 + i * 0.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 + i * 0.4, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
            style={{ border: `1.5px solid ${color}` }}
          />
        ))}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.90 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => { haptic(); onToggle() }}
        disabled={isLoading}
        className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 text-white"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
        animate={{ boxShadow: isPlaying ? `0 4px 32px ${glow}, 0 0 60px ${glow.replace('0.35', '0.1')}` : `0 4px 16px ${glow.replace('0.35', '0.15')}` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isLoading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'var(--animate-spin-disc)' }} />
          : isPlaying
            ? <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
        }
      </motion.button>
    </div>
  )
}

function VolumeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
}
