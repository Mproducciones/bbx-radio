'use client'

import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO } from '@/lib/radioConfig'
import { useNowPlaying } from '@/hooks/useNowPlaying'

export function HomePageClient() {
  const { isPlaying, isLoading, hasError, volume, analyser, toggle, setVolume } = useRadioPlayerContext()
  const { current: nowPlaying } = useNowPlaying()

  return (
    <main
      className="relative w-full flex flex-col flex-1 min-h-0 md:min-h-[calc(100dvh-64px)]"
      style={{ zIndex: 1 }}
    >
      {/* Móvil: reproductor a pantalla completa (referencia app radio PWA) */}
      <div className="md:hidden flex flex-col flex-1 min-h-0 w-full px-2.5 pt-0.5">
        <ClientOnly
          fallback={
            <div className="flex-1 rounded-3xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          }
        >
          <NowPlayingCard
            immersive
            radio={RADIO}
            nowPlaying={{
              title: nowPlaying?.title ?? 'En Vivo',
              artist: nowPlaying?.artist ?? 'Radio Bienvenida 93.3 FM',
              isLive: true,
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

      {/* Desktop: el player vive en la sidebar */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <h2 className="font-display text-5xl text-white leading-none">{RADIO.name}</h2>
        <p className="text-white/45 text-sm mt-2">{RADIO.slogan}</p>
      </div>
    </main>
  )
}
