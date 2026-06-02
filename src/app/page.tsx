'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, ChevronDown } from 'lucide-react'
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
    <main className="relative min-h-screen max-w-md mx-auto flex flex-col" style={{ zIndex: 1 }}>

      {/* Header — nombre de la radio */}
      <div className="md:hidden flex items-center justify-between px-5 pt-5 pb-2">
        <div>
          <h1 className="font-display text-2xl text-white leading-none tracking-wide">{RADIO.name}</h1>
          <p className="text-white/30 text-xs mt-0.5 font-medium">{RADIO.slogan}</p>
        </div>
        <button
          onClick={() => { window.location.href = '/bbx' }}
          onContextMenu={e => e.preventDefault()}
          className="font-display text-lg leading-none px-3 py-1.5 rounded-xl transition-colors"
          style={{
            color: 'var(--color-mag-400)',
            background: 'rgba(219,137,24,0.08)',
            border: '1px solid rgba(219,137,24,0.2)',
            userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation',
          }}
          tabIndex={-1} aria-hidden="true"
        >
          {RADIO.frequency}
        </button>
      </div>

      {/* Player — hero de la app */}
      <div className="md:hidden px-4 pt-3">
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

      {/* Resto del contenido — stagger entrance */}
      <motion.div
        className="flex flex-col gap-5 px-4 pt-5 pb-28"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >

        {/* Banner top */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <RotatingBanner position="top" />
        </motion.div>

        {/* Separador visual */}
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06))' }} />
          <span className="text-white/15 text-[10px] font-bold uppercase tracking-widest">Programación</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }} />
        </motion.div>

        {/* Programación */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
          <ProgramSchedule programs={PROGRAMS} />
        </motion.div>

        {/* Votación */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
          <SongPoll />
        </motion.div>

        {/* Banner middle */}
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <RotatingBanner position="middle" />
        </motion.div>

        {/* Pedir una canción */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
        <div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRequest(v => !v)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative overflow-hidden"
            style={{
              background: showRequest
                ? 'linear-gradient(135deg, rgba(219,137,24,0.1), rgba(168,102,17,0.06))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${showRequest ? 'rgba(219,137,24,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: showRequest ? 'rgba(219,137,24,0.18)' : 'rgba(255,255,255,0.05)' }}>
              <Music2 className="w-5 h-5 transition-colors"
                style={{ color: showRequest ? '#db8918' : 'rgba(255,255,255,0.35)' }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm leading-none">Pedir una canción</p>
              <p className="text-white/30 text-xs mt-0.5">El locutor la pone al aire</p>
            </div>
            <motion.div animate={{ rotate: showRequest ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </motion.div>
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
        </motion.div>

        {/* Banner bottom */}
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <RotatingBanner position="bottom" />
        </motion.div>

      </motion.div>
    </main>
  )
}
