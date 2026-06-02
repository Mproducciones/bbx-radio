'use client'

import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { RadioLocaleBar } from '@/components/player/RadioLocaleBar'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO } from '@/lib/radioConfig'
import { useNowPlaying } from '@/hooks/useNowPlaying'

export function HomePageClient() {
  const { isPlaying, isLoading, hasError, volume, analyser, toggle, setVolume } = useRadioPlayerContext()
  const { current: nowPlaying } = useNowPlaying()

  return (
    <main
      className="relative max-w-md md:max-w-none mx-auto flex flex-col max-md:h-[var(--app-screen-h)] md:min-h-[calc(100dvh-64px)]"
      style={{ zIndex: 1 }}
    >
      {/* Mobile: solo reproductor */}
      <div className="md:hidden flex flex-col flex-1 min-h-0 px-4 pt-2 pb-1">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h1 className="font-display text-xl text-white leading-none tracking-wide">{RADIO.name}</h1>
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

        <ClientOnly fallback={<div className="h-9 mb-2 rounded-xl bg-white/5 animate-pulse shrink-0" />}>
          <RadioLocaleBar radio={RADIO} className="mb-2 shrink-0" />
        </ClientOnly>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <ClientOnly
            fallback={
              <div
                className="w-full rounded-3xl animate-pulse"
                style={{ height: 420, background: 'rgba(255,255,255,0.04)' }}
              />
            }
          >
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
          </ClientOnly>
        </div>

      </div>

      {/* Desktop: el player vive en la sidebar; acá solo guía */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <h2 className="font-display text-5xl text-white leading-none">{RADIO.name}</h2>
      </div>
    </main>
  )
}
