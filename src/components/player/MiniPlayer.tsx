'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { useAlbumColors } from '@/hooks/useAlbumColors'
import { ConcertMode } from './ConcertMode'
import { RADIO, NOW_PLAYING } from '@/lib/radioConfig'

export function MiniPlayer() {
  const pathname = usePathname()
  const { isPlaying, isLoading, hasError, volume, analyser, isConcertMode, toggle, setVolume, openConcert, closeConcert } = useRadioPlayerContext()
  const colors = useAlbumColors(NOW_PLAYING.albumArt)

  // Sólo visible en mobile, fuera del home y cuando no está en admin/studio
  const isHome = pathname === '/'
  const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.startsWith('/bbx')
  const show = !isHome && !isHidden && !hasError

  return (
    <>
      {/* Mini player bar */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
                background: 'rgba(15,12,24,0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${colors.primary}30`,
                boxShadow: `0 -4px 32px ${colors.primary}20, 0 8px 32px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Accent top line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5"
                animate={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)` }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Progress-like ambient glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ background: `radial-gradient(ellipse at 30% 50%, ${colors.primary}12 0%, transparent 60%)` }}
                transition={{ duration: 1.5 }}
              />

              <div className="relative flex items-center gap-3 px-4 py-3">

                {/* Album art mini */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={openConcert}
                  className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}55, ${colors.secondary}33)` }}
                >
                  <motion.span
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="text-xl opacity-60"
                  >
                    ♪
                  </motion.span>
                </motion.button>

                {/* Info — tap para abrir Concert Mode */}
                <button onClick={openConcert} className="flex-1 min-w-0 text-left">
                  <p className="text-white text-sm font-semibold truncate leading-tight">{NOW_PLAYING.title}</p>
                  <p className="text-white/40 text-xs truncate">{NOW_PLAYING.artist}</p>
                </button>

                {/* Live badge */}
                {isPlaying && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                    style={{ color: colors.primary, background: `${colors.primary}18`, border: `1px solid ${colors.primary}30` }}
                  >
                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: colors.primary }} />
                    VIVO
                  </motion.span>
                )}

                {/* Play/Pause */}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={toggle}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                >
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

      {/* Concert Mode overlay */}
      <ConcertMode
        isOpen={isConcertMode}
        onClose={closeConcert}
        radio={RADIO}
        nowPlaying={NOW_PLAYING}
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
