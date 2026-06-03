'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { useNowPlaying } from '@/hooks/useNowPlaying'
import { ConcertMode } from './ConcertMode'
import { RADIO, NOW_PLAYING } from '@/lib/radioConfig'

// Mini EQ bars for "now playing" indicator
function EqBars({ color, playing }: { color: string; playing: boolean }) {
  const heights = [0.5, 1, 0.7, 0.9, 0.55]
  return (
    <div className="flex items-end gap-px h-4 shrink-0">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: color, minHeight: 3, height: h * 16 }}
          animate={playing
            ? { scaleY: [h, 1, h * 0.4, 1, h], height: [h * 16, 16, h * 6, 14, h * 16] }
            : { height: 4, scaleY: 1 }
          }
          transition={{ duration: 0.9 + i * 0.12, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function MiniPlayer() {
  const pathname = usePathname()
  const { isPlaying, isLoading, hasError, volume, analyser, isConcertMode, toggle, setVolume, openConcert, closeConcert } = useRadioPlayerContext()
  const { current: track } = useNowPlaying()
  const colors = useAlbumColors(track?.albumArt)

  const isHome   = pathname === '/'
  const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.startsWith('/bbx')
  const show     = !isHome && !isHidden && !hasError

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed z-[100] md:hidden"
            style={{
              bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
              left: 0, right: 0,
              padding: '0 8px 4px',
            }}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: 'rgba(12,10,20,0.95)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: `1px solid ${colors.primary}35`,
                boxShadow: `0 -2px 24px ${colors.primary}18, 0 8px 40px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Animated top accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 40%, ${colors.secondary} 70%, transparent 100%)` }}
                animate={{ opacity: isPlaying ? [0.6, 1, 0.6] : 0.3 }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Ambient glow when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ background: [`radial-gradient(ellipse at 25% 50%, ${colors.primary}10 0%, transparent 55%)`, `radial-gradient(ellipse at 35% 50%, ${colors.primary}15 0%, transparent 55%)`] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
                />
              )}

              <div className="relative flex items-center gap-3 px-3.5 py-2.5">

                {/* Art + EQ overlay */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={openConcert}
                  className="relative w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}55, ${colors.secondary}33)` }}
                >
                  {track?.albumArt ? (
                    <Image
                      src={track.albumArt}
                      alt=""
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <motion.span
                      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="w-full h-full flex items-center justify-center text-xl opacity-50"
                    >
                      ♪
                    </motion.span>
                  )}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                      <EqBars color="#fff" playing={isPlaying} />
                    </div>
                  )}
                </motion.button>

                {/* Info */}
                <button onClick={openConcert} className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-semibold truncate leading-tight">
                    {track?.title ?? NOW_PLAYING.title}
                  </p>
                    {isPlaying && (
                      <span
                        className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-1"
                        style={{ color: colors.primary, background: `${colors.primary}18`, border: `1px solid ${colors.primary}30` }}
                      >
                        <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: colors.primary }} />
                        VIVO
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs truncate mt-0.5">
                    {track?.artist ?? NOW_PLAYING.artist}
                  </p>
                </button>

                {/* Play/Pause */}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={toggle}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                >
                  {isPlaying && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ border: `1.5px solid ${colors.primary}` }}
                      animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                  {isLoading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : isPlaying
                      ? <PauseIcon className="w-4 h-4 text-white" />
                      : <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                  }
                </motion.button>

                {/* Expand */}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={openConcert}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <ExpandIcon className="w-4 h-4 text-white/40" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConcertMode
        isOpen={isConcertMode}
        onClose={closeConcert}
        radio={RADIO}
        nowPlaying={track ? { ...NOW_PLAYING, title: track.title, artist: track.artist, albumArt: track.albumArt } : NOW_PLAYING}
        isPlaying={isPlaying}
        isLoading={isLoading}
        analyser={analyser}
        colors={colors}
        volume={volume}
        onToggle={toggle}
        onVolumeChange={setVolume}
      />
    </>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
}
function PauseIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
}
function ExpandIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
}
