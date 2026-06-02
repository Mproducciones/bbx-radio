'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Volume1, Volume2, Radio } from 'lucide-react'
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
  const hasRealSong = nowPlaying.title && nowPlaying.title !== 'En Vivo' && nowPlaying.artist && nowPlaying.artist !== radio.name && nowPlaying.artist !== `${radio.name} ${radio.frequency}`
  const colors = useAlbumColors(nowPlaying.albumArt)

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      animate={{ boxShadow: isPlaying ? `0 20px 60px ${colors.glow}, 0 4px 24px rgba(0,0,0,0.6)` : '0 8px 32px rgba(0,0,0,0.4)' }}
      transition={{ duration: 1.5 }}
    >
      {/* Fondo con gradiente de color */}
      <motion.div className="absolute inset-0"
        animate={{ background: `linear-gradient(160deg, ${colors.glow.replace('0.35','0.15')} 0%, rgba(7,7,14,0.95) 60%)` }}
        transition={{ duration: 2 }} />

      {/* Línea accent top */}
      <motion.div className="absolute inset-x-0 top-0 h-0.5"
        animate={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)` }}
        transition={{ duration: 2 }} />

      {/* Border */}
      <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

      <div className="relative">
        {showZenoFallback ? (
          <div className="p-5 flex flex-col gap-2">
            <p className="text-[var(--color-mag-400)] text-xs text-center">Usando reproductor alternativo</p>
            <ZenoEmbed slug={radio.zenoSlug!} />
          </div>
        ) : hasRealSong ? (
          /* ── MODO CANCIÓN — con metadata real ─────────────────────────── */
          <SongView
            radio={radio} nowPlaying={nowPlaying} isPlaying={isPlaying}
            isLoading={isLoading} volume={volume} colors={colors}
            onToggle={onToggle} onVolumeChange={onVolumeChange}
          />
        ) : (
          /* ── MODO ESTACIÓN — sin metadata ──────────────────────────────── */
          <StationView
            radio={radio} isPlaying={isPlaying} isLoading={isLoading}
            volume={volume} colors={colors}
            onToggle={onToggle} onVolumeChange={onVolumeChange}
          />
        )}
      </div>
    </motion.div>
  )
}

// ── Vista de estación (sin metadata) ─────────────────────────────────────────
function StationView({ radio, isPlaying, isLoading, volume, colors, onToggle, onVolumeChange }: {
  radio: RadioConfig; isPlaying: boolean; isLoading: boolean; volume: number
  colors: { primary: string; secondary: string; glow: string }
  onToggle: () => void; onVolumeChange: (v: number) => void
}) {
  const [freq, band] = radio.frequency.split(' ')

  return (
    <div className="relative px-6 pt-7 pb-6">
      {/* Frecuencia enorme como elemento gráfico */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <p className="font-display select-none"
          style={{ fontSize: 'clamp(120px, 40vw, 180px)', color: 'rgba(255,255,255,0.025)', lineHeight: 1, letterSpacing: '-4px' }}>
          {freq}
        </p>
      </div>

      {/* Contenido */}
      <div className="relative flex flex-col gap-5">

        {/* Header: logo + nombre */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl"
            animate={{ boxShadow: isPlaying ? `0 0 24px ${colors.glow}` : '0 4px 12px rgba(0,0,0,0.4)' }}
          >
            <Image src="/icons/icon-512.png" alt={radio.name} width={56} height={56} className="object-contain" />
          </motion.div>
          <div>
            <p className="font-display text-2xl text-white leading-none tracking-wide">{radio.name}</p>
            <p className="text-white/30 text-xs mt-0.5 font-medium">{radio.city} · {radio.country}</p>
          </div>
        </div>

        {/* Frecuencia display */}
        <div>
          <p className="font-display leading-none" style={{ fontSize: 72, color: colors.primary, letterSpacing: '-2px' }}>
            {freq}
            <span className="text-3xl ml-1" style={{ color: `${colors.primary}80` }}>{band || 'FM'}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Radio className="w-3.5 h-3.5" style={{ color: colors.primary, opacity: 0.6 }} />
            <p className="text-white/40 text-xs font-medium tracking-wide uppercase">
              {isPlaying ? 'Transmitiendo en vivo' : 'Radio en vivo · Rancagua'}
            </p>
          </div>
        </div>

        {/* Visualizer mini cuando suena */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-end gap-0.5 h-6">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div key={i} className="flex-1 rounded-full"
                  style={{ background: `linear-gradient(to top, ${colors.primary}, ${colors.secondary})`, opacity: 0.7 }}
                  animate={{ scaleY: [0.2, Math.random() * 0.8 + 0.2, 0.2] }}
                  transition={{ duration: 0.6 + Math.random() * 0.8, repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
                  initial={{ height: 24, transformOrigin: 'bottom' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <PlayButton isPlaying={isPlaying} isLoading={isLoading} onToggle={onToggle} color={colors.primary} glow={colors.glow} size="md" />
          <div className="flex items-center gap-2 flex-1">
            <Volume1 className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
            <input type="range" min={0} max={1} step={0.02} value={volume}
              onChange={e => onVolumeChange(Number(e.target.value))}
              className="flex-1 cursor-pointer" style={{ accentColor: colors.primary }} aria-label="Volumen" />
            <Volume2 className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Vista con canción real ─────────────────────────────────────────────────────
function SongView({ radio, nowPlaying, isPlaying, isLoading, volume, colors, onToggle, onVolumeChange }: {
  radio: RadioConfig; nowPlaying: NowPlaying; isPlaying: boolean; isLoading: boolean; volume: number
  colors: { primary: string; secondary: string; glow: string }
  onToggle: () => void; onVolumeChange: (v: number) => void
}) {
  return (
    <div className="px-6 pt-7 pb-6 flex flex-col items-center gap-5">
      {/* Album art */}
      <motion.div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl"
        animate={{ scale: isPlaying ? 1 : 0.94, boxShadow: isPlaying ? `0 20px 48px ${colors.glow}` : '0 8px 24px rgba(0,0,0,0.5)' }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}>
        {nowPlaying.albumArt
          ? <Image src={nowPlaying.albumArt} alt="Album" fill sizes="160px" className="object-cover" />
          : <Image src="/icons/icon-512.png" alt={radio.name} fill sizes="160px" className="object-contain p-4 opacity-60" />
        }
      </motion.div>

      {/* Song info */}
      <div className="text-center w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={nowPlaying.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <p className="font-display text-3xl text-white leading-none truncate">{nowPlaying.title}</p>
            <p className="text-white/40 text-sm mt-1.5 font-medium truncate">{nowPlaying.artist}</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isPlaying && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full"
              style={{ background: `${colors.primary}15`, border: `1px solid ${colors.primary}30` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.primary }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.primary }}>En vivo</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles */}
      <PlayButton isPlaying={isPlaying} isLoading={isLoading} onToggle={onToggle} color={colors.primary} glow={colors.glow} size="lg" />

      <div className="flex items-center gap-3 w-full">
        <Volume1 className="w-4 h-4 text-white/20 flex-shrink-0" />
        <input type="range" min={0} max={1} step={0.02} value={volume}
          onChange={e => onVolumeChange(Number(e.target.value))}
          className="flex-1 cursor-pointer" style={{ accentColor: colors.primary }} aria-label="Volumen" />
        <Volume2 className="w-4 h-4 text-white/20 flex-shrink-0" />
      </div>
    </div>
  )
}

// ── Botón play reutilizable ───────────────────────────────────────────────────
function PlayButton({ isPlaying, isLoading, onToggle, color, glow, size = 'lg' }: {
  isPlaying: boolean; isLoading: boolean; onToggle: () => void
  color: string; glow: string; size?: 'md' | 'lg'
}) {
  const sz = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
  const ic = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'

  return (
    <div className="relative flex-shrink-0">
      <AnimatePresence>
        {isPlaying && [0, 1].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 1.7 + i * 0.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 + i * 0.5, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' }}
            style={{ border: `1.5px solid ${color}` }} />
        ))}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }}
        onClick={() => { if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10, 30, 10]); onToggle() }}
        disabled={isLoading}
        className={`${sz} rounded-full flex items-center justify-center relative z-10 text-[#07070E]`}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}
        animate={{ boxShadow: isPlaying ? `0 8px 40px ${glow}, 0 0 60px ${glow.replace('0.35','0.06')}` : `0 4px 20px ${glow.replace('0.35','0.18')}` }}
        transition={{ duration: 0.8 }}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isLoading
          ? <div className={`${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} border-2 border-[#07070E]/30 border-t-[#07070E] rounded-full animate-spin`} />
          : isPlaying
            ? <svg className={ic} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg className={`${ic} ml-0.5`} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
        }
      </motion.button>
    </div>
  )
}
