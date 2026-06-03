'use client'

import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { RadioLocaleBar } from '@/components/player/RadioLocaleBar'
import { BbxFrequencyGate } from '@/components/pwa/BbxFrequencyGate'
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
      <div className="md:hidden flex flex-col flex-1 min-h-0 w-full max-w-md mx-auto px-3 pt-2 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
          <div className="min-w-0">
            <h1 className="font-display text-xl text-white leading-none tracking-wide truncate">
              {RADIO.name}
            </h1>
            <p className="text-white/35 text-xs mt-0.5 font-medium truncate">{RADIO.slogan}</p>
          </div>
          <BbxFrequencyGate
            className="font-display text-sm leading-none px-2.5 py-1 rounded-lg shrink-0 active:scale-95 transition-transform"
            style={{
              color: 'var(--color-mag-400)',
              background: 'rgba(219,137,24,0.08)',
              border: '1px solid rgba(219,137,24,0.35)',
            }}
          >
            {RADIO.frequency}
          </BbxFrequencyGate>
        </div>

        <ClientOnly
          fallback={
            <div
              className="mb-2 h-11 w-full rounded-xl animate-pulse shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
          }
        >
          <RadioLocaleBar radio={RADIO} compact className="mb-2 shrink-0 relative z-[4]" />
        </ClientOnly>

        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
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

        <p className="text-center text-white/25 text-[10px] font-medium uppercase tracking-wide mt-2 mb-1 leading-relaxed px-2 shrink-0">
          Mantén el logo · 5 toques en {RADIO.frequency} → BBX
        </p>
      </div>

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
