'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { useNowPlaying } from '@/hooks/useNowPlaying'
import { isMiniPlayerSlimRoute } from '@/lib/miniPlayerRoutes'
import { ConcertMode } from './ConcertMode'
import { RADIO, NOW_PLAYING } from '@/lib/radioConfig'

function EqBars({ color, playing, compact }: { color: string; playing: boolean; compact?: boolean }) {
  const heights = [0.5, 1, 0.7, 0.9, 0.55]
  const h = compact ? 12 : 16
  return (
    <div className={`flex items-end gap-px shrink-0 ${compact ? 'h-3' : 'h-4'}`}>
      {heights.map((bar, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: color, minHeight: 2, height: bar * h }}
          animate={playing
            ? { scaleY: [bar, 1, bar * 0.4, 1, bar], height: [bar * h, h, bar * 4, h * 0.85, bar * h] }
            : { height: 3, scaleY: 1 }
          }
          transition={{ duration: 0.9 + i * 0.12, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function MiniPlayer() {
  const pathname = usePathname()
  const { isPlaying, isLoading, hasError, analyser, isConcertMode, toggle, openConcert, closeConcert } = useRadioPlayerContext()
  const { current: track } = useNowPlaying()
  const colors = useAlbumColors(track?.albumArt)

  const isHome = pathname === '/'
  const isHidden =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/bbx') ||
    pathname.startsWith('/anunciate')
  const slim = isMiniPlayerSlimRoute(pathname)
  const show = !isHome && !isHidden && !hasError

  const artSize = slim ? 32 : 36
  const playSize = slim ? 36 : 40

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 480, damping: 34 }}
            className="fixed z-[100] md:hidden max-w-full min-w-0"
            style={{
              bottom: 'var(--app-nav-total)',
              left: 'var(--app-shell-pad-x)',
              right: 'var(--app-shell-pad-right)',
              height: 'var(--app-mini-player-h)',
              paddingBottom: 4,
            }}
          >
            <div
              className="relative h-full w-full min-w-0 max-w-full overflow-hidden rounded-2xl flex items-center"
              style={{
                background: 'linear-gradient(180deg, rgba(18,16,28,0.98) 0%, rgba(10,10,16,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: slim
                  ? '0 8px 24px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : `0 8px 28px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              {!slim && isPlaying && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    background: [
                      `radial-gradient(ellipse at 20% 50%, ${colors.primary}08 0%, transparent 50%)`,
                      `radial-gradient(ellipse at 30% 50%, ${colors.primary}12 0%, transparent 50%)`,
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
                />
              )}

              <div className={`relative flex items-center w-full min-w-0 max-w-full ${slim ? 'gap-2 px-2' : 'gap-2.5 px-2.5'}`}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={slim ? toggle : openConcert}
                  className="relative rounded-lg flex-shrink-0 overflow-hidden"
                  style={{
                    width: artSize,
                    height: artSize,
                    background: `linear-gradient(135deg, ${colors.primary}44, ${colors.secondary}22)`,
                  }}
                  aria-label={slim ? (isPlaying ? 'Pausar' : 'Reproducir') : 'Abrir reproductor'}
                >
                  {track?.albumArt ? (
                    <Image
                      src={track.albumArt}
                      alt=""
                      width={artSize}
                      height={artSize}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-base opacity-50">♪</span>
                  )}
                  {isPlaying && !slim && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 rounded-lg">
                      <EqBars color="#fff" playing compact />
                    </div>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={slim ? toggle : openConcert}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-white text-xs font-semibold truncate leading-tight">
                    {track?.title ?? NOW_PLAYING.title}
                  </p>
                  {!slim && (
                    <p className="text-white/40 text-[10px] truncate mt-0.5">
                      {track?.artist ?? NOW_PLAYING.artist}
                    </p>
                  )}
                </button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={toggle}
                  disabled={isLoading}
                  className="rounded-full flex items-center justify-center flex-shrink-0 border border-white/10"
                  style={{
                    width: playSize,
                    height: playSize,
                    background: isPlaying
                      ? `linear-gradient(145deg, ${colors.primary}, color-mix(in srgb, ${colors.primary} 75%, var(--color-ink-900)))`
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: isPlaying
                      ? `0 4px 16px -4px color-mix(in srgb, ${colors.primary} 50%, transparent)`
                      : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <PauseIcon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <PlayIcon className="w-3.5 h-3.5 text-white ml-0.5" />
                  )}
                </motion.button>

                {!slim && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={openConcert}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    aria-label="Pantalla completa"
                  >
                    <ExpandIcon className="w-3.5 h-3.5 text-white/40" />
                  </motion.button>
                )}
              </div>
            </div>
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
        onToggle={toggle}
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
