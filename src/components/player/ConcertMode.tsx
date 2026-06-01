'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioVisualizer } from './AudioVisualizer'
import type { NowPlaying, RadioConfig } from '@/types/radio'
import type { AlbumColors } from '@/hooks/useAlbumColors'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import Image from 'next/image'

interface ConcertModeProps {
  isOpen: boolean
  onClose: () => void
  radio: RadioConfig
  nowPlaying: NowPlaying
  isPlaying: boolean
  isLoading: boolean
  analyser: AnalyserNode | null
  colors: AlbumColors
  volume: number
  onToggle: () => void
  onVolumeChange: (v: number) => void
}

export function ConcertMode({
  isOpen, onClose, radio, nowPlaying, isPlaying,
  isLoading, analyser, colors, volume, onToggle, onVolumeChange,
}: ConcertModeProps) {

  // Swipe down to close
  useEffect(() => {
    if (!isOpen) return
    let startY = 0
    const onTouch = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      if (e.changedTouches[0].clientY - startY > 80) onClose()
    }
    document.addEventListener('touchstart', onTouch)
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('touchstart', onTouch)
      document.removeEventListener('touchend', onEnd)
    }
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const haptic = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(isPlaying ? [8] : [10, 30, 10])
  }, [isPlaying])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="fixed inset-0 z-[300] flex flex-col overflow-hidden"
          style={{ background: '#07070E' }}
        >
          {/* ── Fondo respirante ────────────────────────────── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                `radial-gradient(ellipse at 30% 20%, ${colors.primary}28 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, ${colors.secondary}20 0%, transparent 55%)`,
                `radial-gradient(ellipse at 70% 30%, ${colors.primary}28 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, ${colors.secondary}20 0%, transparent 55%)`,
                `radial-gradient(ellipse at 30% 20%, ${colors.primary}28 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, ${colors.secondary}20 0%, transparent 55%)`,
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Grain overlay sutil */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '150px' }}
          />

          {/* ── Header ──────────────────────────────────────── */}
          <div className="relative flex items-center justify-between px-6 pt-safe pt-6 pb-2 flex-shrink-0">
            {/* Handle swipe */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />

            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-medium">{radio.name}</p>
              <p className="text-white/20 text-[10px]">{radio.frequency} · {radio.city}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <ChevronDownIcon className="w-5 h-5 text-white/60" />
            </motion.button>
          </div>

          {/* ── Artwork / Album Art ──────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">

            {/* Artwork con glow pulsante */}
            <div className="relative">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  animate={isPlaying
                    ? { scale: [1, 1.08 + i * 0.06, 1], opacity: [0.3 - i * 0.08, 0, 0.3 - i * 0.08] }
                    : { scale: 1, opacity: 0 }
                  }
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                  style={{ background: colors.primary, filter: 'blur(20px)' }}
                />
              ))}

              <motion.div
                className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl"
                animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 0.95 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}66, ${colors.secondary}44)`,
                  border: `1px solid ${colors.primary}40`,
                  boxShadow: `0 32px 64px ${colors.primary}44`,
                }}
              >
                {nowPlaying.albumArt ? (
                  <Image src={nowPlaying.albumArt} alt="Album art" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="text-7xl opacity-40"
                    >
                      ♪
                    </motion.span>
                  </div>
                )}

                {/* Overlay reflejo */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
              </motion.div>
            </div>

            {/* Song info */}
            <motion.div
              key={nowPlaying.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <h2 className="font-display text-4xl text-white leading-none tracking-wide truncate px-4">
                {nowPlaying.title}
              </h2>
              <p className="text-white/50 text-base mt-2">{nowPlaying.artist}</p>
            </motion.div>

            {/* Visualizador grande */}
            <div className="w-full h-16">
              <AudioVisualizer
                analyser={analyser}
                isPlaying={isPlaying}
                barColor={colors.primary}
                barCount={64}
              />
            </div>
          </div>

          {/* ── Controles ────────────────────────────────────── */}
          <div className="flex-shrink-0 px-8 pb-safe pb-8 flex flex-col gap-5">

            {/* Play / volumen */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 flex-1">
                <VolumeIcon className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type="range" min={0} max={1} step={0.02} value={volume}
                  onChange={e => onVolumeChange(Number(e.target.value))}
                  className="flex-1 h-1 cursor-pointer"
                  style={{ accentColor: colors.primary }}
                />
                <VolumeHighIcon className="w-4 h-4 text-white/30 flex-shrink-0" />
              </div>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => { haptic(); onToggle() }}
                disabled={isLoading}
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 8px 32px ${colors.primary}66`,
                }}
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : isPlaying
                    ? <PauseIcon className="w-7 h-7 text-white" />
                    : <PlayIcon className="w-7 h-7 text-white ml-1" />
                }
              </motion.button>
            </div>

            {/* Solicitar canción */}
            <details className="group">
              <summary
                className="list-none flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold cursor-pointer select-none"
                style={{ background: `${colors.primary}15`, color: colors.primary, border: `1px solid ${colors.primary}30` }}
              >
                <MicIcon className="w-4 h-4" />
                Pedir una canción
                <svg className="w-3 h-3 opacity-50 group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              </summary>
              <div className="mt-3">
                <SongRequestForm />
              </div>
            </details>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
}
function PlayIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
}
function PauseIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
}
function VolumeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>
}
function VolumeHighIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
}
function MicIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 15.2 14.47 17 12 17s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
}
