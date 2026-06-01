'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Volume1, Volume2 } from 'lucide-react'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ZenoEmbed } from './ZenoEmbed'

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
      className="relative overflow-hidden rounded-3xl"
      animate={{
        boxShadow: isPlaying
          ? `0 24px 64px ${colors.glow}, 0 4px 24px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.4)',
      }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Glow background que cambia con el álbum */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse at 50% -20%, ${colors.glow.replace('0.35','0.12')} 0%, transparent 65%)` }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      {/* Línea accent top */}
      <motion.div className="absolute inset-x-0 top-0 h-px"
        animate={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)` }}
        transition={{ duration: 2 }}
      />

      <div className="relative px-6 pt-8 pb-7 flex flex-col items-center gap-6">

        {showZenoFallback ? (
          <div className="w-full flex flex-col gap-2">
            <p className="text-[var(--color-mag-400)] text-xs text-center">Usando reproductor alternativo</p>
            <ZenoEmbed slug={radio.zenoSlug!} />
          </div>
        ) : (
          <>
            {/* Logo / Album art — GRANDE y centrado */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="relative"
                animate={{ scale: isPlaying ? 1 : 0.92 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-[-8px] rounded-[2.5rem]"
                  animate={{ opacity: isPlaying ? 1 : 0 }}
                  transition={{ duration: 1 }}
                  style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
                />
                {/* Pulse rings on play */}
                <AnimatePresence>
                  {isPlaying && [0, 1].map(i => (
                    <motion.div key={i}
                      className="absolute inset-[-4px] rounded-[2.5rem] pointer-events-none"
                      initial={{ scale: 1, opacity: 0.4 }}
                      animate={{ scale: 1.15 + i * 0.1, opacity: 0 }}
                      transition={{ duration: 2 + i * 0.6, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
                      style={{ border: `1px solid ${colors.primary}` }}
                    />
                  ))}
                </AnimatePresence>

                <motion.div
                  className="w-36 h-36 rounded-[2rem] overflow-hidden shadow-2xl relative"
                  animate={{ boxShadow: isPlaying ? `0 16px 48px ${colors.glow}` : '0 8px 24px rgba(0,0,0,0.5)' }}
                  transition={{ duration: 1.2 }}
                >
                  {nowPlaying.albumArt ? (
                    <Image src={nowPlaying.albumArt} alt="Album" fill sizes="144px" className="object-cover" />
                  ) : (
                    <Image src="/icons/icon-512.png" alt={radio.name} fill sizes="144px" className="object-contain p-3" />
                  )}
                </motion.div>
              </motion.div>

              {/* Live badge */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: `${colors.primary}18`, border: `1px solid ${colors.primary}35` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.primary }} />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.primary }}>
                      En vivo · {radio.frequency}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Song info — centrado, tipografía dramática */}
            <div className="text-center w-full px-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={nowPlaying.title}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <p className="font-display text-4xl text-white leading-none tracking-wide truncate">
                    {nowPlaying.title}
                  </p>
                  <p className="text-white/40 text-sm mt-1.5 truncate font-medium">{nowPlaying.artist}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Play button centrado y grande */}
            <PlayButton isPlaying={isPlaying} isLoading={isLoading} onToggle={onToggle} color={colors.primary} glow={colors.glow} />

            {/* Volume — ancho completo */}
            <div className="flex items-center gap-3 w-full">
              <Volume1 className="w-4 h-4 text-white/20 flex-shrink-0" />
              <input
                type="range" min={0} max={1} step={0.02} value={volume}
                onChange={e => onVolumeChange(Number(e.target.value))}
                className="flex-1 h-1 cursor-pointer rounded-full appearance-none"
                style={{ accentColor: colors.primary }}
                aria-label="Volumen"
              />
              <Volume2 className="w-4 h-4 text-white/20 flex-shrink-0" />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

function PlayButton({ isPlaying, isLoading, onToggle, color, glow }: {
  isPlaying: boolean; isLoading: boolean; onToggle: () => void; color: string; glow: string
}) {
  function haptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10, 30, 10])
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isPlaying && [0, 1].map(i => (
          <motion.div key={i}
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6 + i * 0.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
            style={{ border: `2px solid ${color}` }}
          />
        ))}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.06 }}
        onClick={() => { haptic(); onToggle() }}
        disabled={isLoading}
        className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 text-[#07070E]"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}
        animate={{ boxShadow: isPlaying ? `0 8px 40px ${glow}, 0 0 80px ${glow.replace('0.35','0.08')}` : `0 4px 20px ${glow.replace('0.35','0.2')}` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isLoading
          ? <div className="w-6 h-6 border-2 border-[#07070E]/30 border-t-[#07070E] rounded-full animate-spin" />
          : isPlaying
            ? <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
        }
      </motion.button>
    </div>
  )
}
