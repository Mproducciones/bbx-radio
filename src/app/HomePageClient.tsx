'use client'

import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { RadioLocaleBar } from '@/components/player/RadioLocaleBar'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO } from '@/lib/radioConfig'
import { useNowPlaying } from '@/hooks/useNowPlaying'

export function HomePageClient() {
  const { isPlaying, isLoading, hasError, volume, analyser, toggle, setVolume } = useRadioPlayerContext()
  const { current: nowPlaying } = useNowPlaying()

  return (
    <main
      className="relative min-h-[calc(100dvh-64px)] max-w-md md:max-w-none mx-auto flex flex-col"
      style={{ zIndex: 1 }}
    >
      {/* Mobile: solo reproductor */}
      <div className="md:hidden flex flex-col flex-1 px-4 pt-5 pb-28">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-display text-2xl text-white leading-none tracking-wide">{RADIO.name}</h1>
            <p className="text-white/30 text-xs mt-0.5 font-medium">{RADIO.slogan}</p>
          </div>
          <span
            className="font-display text-lg leading-none px-3 py-1.5 rounded-xl"
            style={{
              color: 'var(--color-mag-400)',
              background: 'rgba(219,137,24,0.08)',
              border: '1px solid rgba(219,137,24,0.2)',
            }}
          >
            {RADIO.frequency}
          </span>
        </div>

        <RadioLocaleBar radio={RADIO} className="mb-4" />

        <div className="flex-1 flex flex-col justify-center min-h-0">
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

        <p className="text-center text-white/15 text-[10px] font-medium uppercase tracking-widest mt-6 leading-relaxed px-4">
          Mantén el logo · triple toque en la onda
        </p>
      </div>

      {/* Desktop: el player vive en la sidebar; acá solo guía */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <p className="text-[var(--color-mag-400)] text-[10px] font-black uppercase tracking-widest mb-3">
          Transmitiendo en vivo
        </p>
        <h2 className="font-display text-5xl text-white leading-none mb-4">{RADIO.name}</h2>
        <p className="text-[var(--color-ink-400)] text-sm max-w-sm">
          Usa el menú lateral para ver la grilla, participar en la votación, mandar saludos y más.
        </p>
      </div>
    </main>
  )
}
