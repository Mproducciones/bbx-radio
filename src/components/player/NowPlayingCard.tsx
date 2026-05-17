/**
 * Componente de tarjeta de reproducción "Now Playing"
 * 
 * Muestra el estado actual del reproductor de radio con:
 * - Logo de la radio
 * - Información de la canción actual
 * - Visualizador de audio
 * - Controles de reproducción (play/pause)
 * - Control de volumen
 * - Fallback a ZenoEmbed si el stream directo falla
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AudioVisualizer } from './AudioVisualizer'
import { ZenoEmbed } from './ZenoEmbed'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { NowPlaying, RadioConfig } from '@/types/radio'

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
  radio,
  nowPlaying,
  isPlaying,
  isLoading,
  hasError,
  volume,
  analyser,
  onToggle,
  onVolumeChange,
}: NowPlayingCardProps) {
  const showZenoFallback = hasError && !!radio.zenoSlug
  return (
    <div className="pulso-player-card flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-ink-600)] flex items-center justify-center overflow-hidden shadow-lg shadow-[var(--color-mag-400)]/30 relative">
            <Image
              src="/LOGO_BIENVENIDA (1)_PhotoGrid.png"
              alt={radio.name}
              fill
              sizes="(max-width: 768px) 48px, 48px"
              quality={100}
              className="object-cover"
              priority
            />
          </div>
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
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-mag-400)]"
                style={{ animation: 'var(--animate-live-dot)' }}
              />
              EN VIVO
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Player area: visualizer nativo o embed Zeno como fallback */}
      <AnimatePresence mode="wait">
        {showZenoFallback ? (
          <motion.div
            key="zeno"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-[var(--color-amb-400)] text-xs text-center">
              Stream directo no disponible · Usando reproductor alternativo
            </p>
            <ZenoEmbed slug={radio.zenoSlug!} />
          </motion.div>
        ) : (
          <motion.div key="native" className="flex flex-col gap-4">
            {/* Visualizer */}
            <div className="h-[80px] w-full bg-[var(--color-ink-800)] rounded-lg overflow-hidden">
              <AudioVisualizer
                analyser={analyser}
                isPlaying={isPlaying}
                barColor="#db8918"
                barCount={48}
              />
            </div>

            {/* Now Playing info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={nowPlaying.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4"
              >
                <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-[var(--color-mag-800)] to-[var(--color-pur-800)] flex items-center justify-center">
                  <MusicNoteIcon className="w-6 h-6 text-[var(--color-mag-400)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-md truncate">{nowPlaying.title}</p>
                  <p className="text-[var(--color-ink-300)] text-sm truncate">{nowPlaying.artist}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={onToggle}
                disabled={isLoading}
                className={cn(
                  'pulso-btn pulso-btn-primary w-20 h-20 rounded-full justify-center p-0 flex-shrink-0 shadow-lg shadow-[var(--color-mag-400)]/20',
                  isLoading && 'opacity-60 cursor-wait'
                )}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : isPlaying ? (
                  <PauseIcon className="w-8 h-8" />
                ) : (
                  <PlayIcon className="w-8 h-8 ml-1" />
                )}
              </motion.button>

              <div className="flex items-center gap-2 flex-1">
                <VolumeIcon className="w-4 h-4 text-[var(--color-ink-300)] flex-shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="flex-1 h-1 accent-[#db8918] cursor-pointer"
                  aria-label="Volumen"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  )
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <div
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      style={{ animation: 'var(--animate-spin-disc)' }}
    />
  )
}
