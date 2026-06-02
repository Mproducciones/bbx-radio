'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Volume1, Volume2 } from 'lucide-react'
import Image from 'next/image'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ZenoEmbed } from './ZenoEmbed'
import { BorderBeam } from '@/components/ui/effects'

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
  volume, onToggle, onVolumeChange,
}: NowPlayingCardProps) {
  const showZenoFallback = hasError && !!radio.zenoSlug
  const hasAlbumArt = !!(nowPlaying.albumArt)
  const hasRealSong = nowPlaying.title && nowPlaying.title !== 'En Vivo'
    && nowPlaying.artist && nowPlaying.artist !== radio.name
    && nowPlaying.artist !== `${radio.name} ${radio.frequency}`

  const colors = useAlbumColors(nowPlaying.albumArt)
  const [freq, band] = radio.frequency.split(' ')

  const displayTitle  = hasRealSong ? nowPlaying.title  : radio.name
  const displayArtist = hasRealSong ? nowPlaying.artist : `${radio.city} · ${freq} ${band || 'FM'}`

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: 'rgba(12,12,20,0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      animate={{
        boxShadow: isPlaying
          ? `0 24px 64px ${colors.glow}, 0 4px 24px rgba(0,0,0,0.7)`
          : '0 8px 32px rgba(0,0,0,0.5)',
        border: isPlaying
          ? `1px solid ${colors.primary}30`
          : '1px solid rgba(255,255,255,0.07)',
      }}
      transition={{ duration: 1.2 }}
    >
      {/* BorderBeam cuando suena */}
      <AnimatePresence>
        {isPlaying && <BorderBeam colorFrom={colors.primary} colorTo={colors.secondary} duration={3} />}
      </AnimatePresence>

      {/* ── COVER ART ───────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
        {hasAlbumArt ? (
          <Image
            src={nowPlaying.albumArt!}
            alt={displayTitle ?? 'cover'}
            fill sizes="100%"
            className="object-cover"
          />
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ background: `linear-gradient(160deg, ${colors.glow.replace('0.35','0.25')} 0%, rgba(7,7,14,1) 100%)` }}
            transition={{ duration: 2 }}
          >
            {/* Frecuencia decorativa de fondo */}
            <p className="absolute font-display select-none pointer-events-none opacity-[0.04]"
              style={{ fontSize: 'clamp(100px,35vw,160px)', color: '#fff', letterSpacing: '-4px' }}>
              {freq}
            </p>
            {/* Logo centrado */}
            <motion.div
              className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl"
              animate={{ boxShadow: isPlaying ? `0 0 40px ${colors.glow}` : '0 4px 16px rgba(0,0,0,0.5)' }}
            >
              <Image src="/icons/icon-512.png" alt={radio.name} fill sizes="96px" className="object-contain p-2" />
            </motion.div>
          </motion.div>
        )}

        {/* Gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(12,12,20,1) 0%, transparent 100%)' }} />

        {/* Badge EN VIVO */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', border: `1px solid ${colors.primary}40`, backdropFilter: 'blur(8px)' }}>
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: colors.primary }}
              animate={{ opacity: isPlaying ? [1, 0.3, 1] : 0.4 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.primary }}>
              En Vivo
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ───────────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-5 flex flex-col gap-4">

        {showZenoFallback ? (
          <ZenoEmbed slug={radio.zenoSlug!} />
        ) : (
          <>
            {/* Título + artista */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={displayTitle}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-white font-bold text-base leading-tight truncate">{displayTitle}</p>
                <p className="text-white/40 text-xs mt-1 truncate">{displayArtist}</p>
              </motion.div>
            </AnimatePresence>

            {/* Waveform live cuando suena */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 28 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-end justify-center gap-0.5"
                >
                  {Array.from({ length: 32 }).map((_, i) => (
                    <motion.div key={i} className="rounded-full flex-shrink-0"
                      style={{ width: 3, background: `linear-gradient(to top, ${colors.primary}, ${colors.secondary})`, opacity: 0.75 }}
                      animate={{ scaleY: [0.15, Math.random() * 0.85 + 0.15, 0.15] }}
                      transition={{ duration: 0.5 + Math.random() * 0.8, repeat: Infinity, delay: i * 0.03, ease: 'easeInOut' }}
                      initial={{ height: 28, transformOrigin: 'bottom' }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CONTROLS PILL ────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">

              {/* Volume */}
              <div className="flex items-center gap-2 flex-1">
                <Volume1 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.primary, opacity: 0.5 }} />
                <div
                  className="flex-1 relative h-1 rounded-full cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    onVolumeChange(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ background: colors.primary }}
                    animate={{ width: `${volume * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>
                <Volume2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.primary, opacity: 0.5 }} />
              </div>

              {/* Play button */}
              <PlayButton
                isPlaying={isPlaying} isLoading={isLoading}
                onToggle={onToggle} color={colors.primary} glow={colors.glow}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Botón play ────────────────────────────────────────────────────────────────
function PlayButton({ isPlaying, isLoading, onToggle, color, glow }: {
  isPlaying: boolean; isLoading: boolean; onToggle: () => void
  color: string; glow: string
}) {
  return (
    <div className="relative flex-shrink-0">
      <AnimatePresence>
        {isPlaying && [0, 1].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8 + i * 0.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 + i * 0.6, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' }}
            style={{ border: `1.5px solid ${color}` }} />
        ))}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }}
        onClick={() => { if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10, 30, 10]); onToggle() }}
        disabled={isLoading}
        className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)`, color: '#07070E' }}
        animate={{ boxShadow: isPlaying ? `0 8px 40px ${glow}, 0 0 60px ${glow.replace('0.35','0.06')}` : `0 4px 20px ${glow.replace('0.35','0.15')}` }}
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
