'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SocialLinks, FacebookIcon, InstagramIcon, TwitterXIcon, WhatsAppIcon } from '@/components/nav/SocialLinks'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO, PROGRAMS, RADIO_TV_HLS } from '@/lib/radioConfig'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { HlsPlayer } from '@/components/player/HlsPlayer'
import { SongHistory } from '@/components/player/SongHistory'
import { SongPoll } from '@/components/engagement/SongPoll'
import { useNowPlaying } from '@/hooks/useNowPlaying'

const SOCIAL_LINKS = [
  { label: 'Facebook',    href: 'https://www.facebook.com/RadioBienvenida',   icon: FacebookIcon,  color: '#1877F2' },
  { label: 'Instagram',   href: 'https://www.instagram.com/radiobienvenida/', icon: InstagramIcon, color: '#E1306C' },
  { label: 'Twitter / X', href: 'https://twitter.com/BienvenidaFM',           icon: TwitterXIcon,  color: '#AAAABB' },
  { label: 'WhatsApp',    href: 'https://wa.me/56950291592',                  icon: WhatsAppIcon,  color: '#25D366' },
]

type Panel = 'tv' | 'solicitar' | 'historial' | null

export default function HomePage() {
  const { isPlaying, isLoading, hasError, volume, analyser, isTvOpen, openTv, closeTv, toggle, setVolume, play } = useRadioPlayerContext()
  const { current: nowPlaying } = useNowPlaying()
  const [panel, setPanel] = useState<Panel>(null)

  const handleRadioToggle = () => {
    if (isTvOpen) { closeTv(); play(); return }
    toggle()
  }

  function togglePanel(p: Panel) {
    setPanel(prev => {
      if (prev === p) return null
      if (p === 'tv')   { if (!isTvOpen) openTv(); return 'tv' }
      if (prev === 'tv') closeTv()
      return p
    })
  }

  // Sync TV state
  const tvOpen = panel === 'tv' && isTvOpen

  const ACTIONS: { id: Panel; icon: string; label: string }[] = [
    { id: 'tv',        icon: '📺', label: 'TV en vivo' },
    { id: 'solicitar', icon: '🎵', label: 'Pedir canción' },
    { id: 'historial', icon: '⏱',  label: 'Qué sonó' },
  ]

  return (
    <main className="relative min-h-screen px-4 py-4 max-w-md md:max-w-3xl mx-auto flex flex-col gap-4" style={{ zIndex: 1 }}>

      {/* Header — solo mobile */}
      <header className="md:hidden flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white leading-none">{RADIO.name}</h1>
          <p className="text-[var(--color-ink-400)] text-xs mt-1">{RADIO.slogan}</p>
        </div>
        <button
          onClick={() => { window.location.href = '/bbx' }}
          onContextMenu={e => e.preventDefault()}
          className="font-display text-[var(--color-mag-400)] text-3xl bg-transparent border-0 p-0 m-0 outline-none cursor-pointer leading-none"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation', fontFamily: 'var(--font-display)' }}
          tabIndex={-1} aria-hidden="true"
        >
          {RADIO.frequency}
        </button>
      </header>

      {/* Banner superior */}
      <RotatingBanner position="top" />

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
          onToggle={handleRadioToggle}
          onVolumeChange={setVolume}
        />
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-2 md:hidden">
        {ACTIONS.map(a => (
          <motion.button
            key={a.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => togglePanel(a.id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold transition-all"
            style={panel === a.id
              ? { background: 'rgba(219,137,24,0.15)', border: '1px solid rgba(219,137,24,0.4)', color: '#db8918' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }
            }
          >
            <span className="text-lg">{a.icon}</span>
            <span>{a.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Panel expandible */}
      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {panel === 'tv' && (
              <div className="rounded-2xl overflow-hidden bg-black">
                <HlsPlayer src={RADIO_TV_HLS} title="Bienvenida TV en vivo" shouldPlay />
              </div>
            )}
            {panel === 'solicitar' && <SongRequestForm />}
            {panel === 'historial' && <SongHistory />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Programación */}
      <ProgramSchedule programs={PROGRAMS} />

      {/* Votación — solo si hay una activa */}
      <SongPoll />

      {/* Banner inferior */}
      <RotatingBanner position="bottom" />

      {/* Footer */}
      <footer className="text-center text-[var(--color-ink-500)] text-xs pb-4 flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-ink-700)]">
        <SocialLinks links={SOCIAL_LINKS} />
        <span className="text-[var(--color-ink-400)]">Powered by BBX</span>
      </footer>

    </main>
  )
}
