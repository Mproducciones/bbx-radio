'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO, PROGRAMS } from '@/lib/radioConfig'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { SongPoll } from '@/components/engagement/SongPoll'
import { useNowPlaying } from '@/hooks/useNowPlaying'

export default function HomePage() {
  const { isPlaying, isLoading, hasError, volume, analyser, toggle, setVolume } = useRadioPlayerContext()
  const { current: nowPlaying } = useNowPlaying()
  const [showRequest, setShowRequest] = useState(false)

  return (
    <main className="relative min-h-screen px-4 py-6 max-w-md mx-auto flex flex-col gap-5" style={{ zIndex: 1 }}>

      {/* Header mínimo — solo mobile */}
      <div className="md:hidden flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white leading-none">{RADIO.name}</h1>
          <p className="text-[var(--color-ink-400)] text-xs mt-0.5">{RADIO.slogan}</p>
        </div>
        <button
          onClick={() => { window.location.href = '/bbx' }}
          onContextMenu={e => e.preventDefault()}
          className="font-display text-[var(--color-mag-400)] text-2xl bg-transparent border-0 outline-none cursor-pointer leading-none"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation', fontFamily: 'var(--font-display)' }}
          tabIndex={-1} aria-hidden="true"
        >
          {RADIO.frequency}
        </button>
      </div>

      {/* Player — solo mobile */}
      <div className="md:hidden">
        <NowPlayingCard
          radio={RADIO}
          nowPlaying={{
            title:     nowPlaying?.title  ?? 'En Vivo',
            artist:    nowPlaying?.artist ?? 'Radio Bienvenida 93.3 FM',
            isLive:    true,
            startedAt: new Date(0),
          }}
          isPlaying={isPlaying}
          isLoading={isLoading}
          hasError={hasError}
          volume={volume}
          analyser={analyser}
          onToggle={toggle}
          onVolumeChange={setVolume}
        />
      </div>

      {/* Publicidad */}
      <RotatingBanner position="top" />

      {/* Programación */}
      <ProgramSchedule programs={PROGRAMS} />

      {/* Votación — solo si hay una activa */}
      <SongPoll />

      {/* Pedir una canción */}
      <div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRequest(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{
            background: showRequest ? 'rgba(219,137,24,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showRequest ? 'rgba(219,137,24,0.3)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎵</span>
            <span className="text-white font-semibold text-sm">Pedir una canción</span>
          </div>
          <motion.span
            animate={{ rotate: showRequest ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[var(--color-ink-400)]"
          >
            ▾
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {showRequest && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="pt-2">
                <SongRequestForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  )
}
