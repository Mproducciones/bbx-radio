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
      className="relative w-full flex flex-col flex-1 min-h-0 md:min-h-[calc(100dvh-64px)] overflow-x-hidden"
      style={{ zIndex: 1 }}
    >
      <div className="md:hidden flex flex-col flex-1 min-h-0 w-full min-w-0 max-w-full pt-2 pb-2 overflow-x-hidden box-border">
        <div className="flex items-center justify-between gap-3 mb-2 shrink-0 min-w-0 max-w-full rounded-xl px-3 py-2.5 border border-white/[0.07] bg-white/[0.03]">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg text-white leading-none tracking-wide truncate">
              {RADIO.name}
            </h1>
            <p className="text-white/40 text-[11px] mt-1 font-medium truncate">{RADIO.slogan}</p>
          </div>
          <BbxFrequencyGate
            className="font-display text-sm leading-none px-2.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-transform"
            style={{
              color: 'var(--color-mag-400)',
              background: 'color-mix(in srgb, var(--color-mag-400) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-mag-400) 38%, transparent)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
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
      </div>

      {/* Desktop: panel central inmersivo */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-[80vh] px-8 text-center relative overflow-hidden">
        {/* Gradient background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(219,137,24,0.1) 0%, rgba(64,185,191,0.04) 40%, transparent 70%)' }} />

        {/* Radio waves SVG animation */}
        <div className="relative mb-10" style={{ width: 120, height: 120 }}>
          {/* Rings */}
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="radio-wave absolute inset-0 rounded-full"
              style={{ color: '#db8918', animationDelay: `${i * 0.65}s` }}
            />
          ))}
          {/* Center dot */}
          <div
            className="absolute inset-0 m-auto flex items-center justify-center rounded-full"
            style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, rgba(219,137,24,0.2), rgba(219,137,24,0.08))',
              border: '1.5px solid rgba(219,137,24,0.4)',
              boxShadow: '0 0 40px rgba(219,137,24,0.3)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#db8918">
              <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-2.5-5.5L16 12l-6.5-3.5v7z"/>
            </svg>
          </div>
        </div>

        {/* Live badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 glass-amber"
        >
          <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
          <span className="text-[#db8918] text-[10px] font-black uppercase tracking-widest">Transmitiendo en vivo</span>
        </div>

        <h2 className="font-display text-gradient-gold leading-none mb-2 tracking-wide"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          {RADIO.name}
        </h2>
        <p className="text-[#40B9BF] font-bold text-xl mb-2">{RADIO.frequency}</p>
        <p className="text-white/30 text-sm mb-10">{RADIO.city}</p>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { href: '/programacion', label: '📋 Grilla',        accent: '#db8918' },
            { href: '/participa',    label: '🎵 Votar',          accent: '#40B9BF' },
            { href: '/saludos',      label: '💬 Mandar saludo',  accent: '#7D59B5' },
            { href: '/noticias',     label: '📰 Noticias',       accent: '#00D9A0' },
          ].map(({ href, label, accent }) => (
            <a
              key={href}
              href={href}
              className="glass card-lift text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              style={{ color: 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = '#fff'
                el.style.borderColor = `${accent}50`
                el.style.boxShadow = `0 4px 20px -4px ${accent}40`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(255,255,255,0.65)'
                el.style.borderColor = ''
                el.style.boxShadow = ''
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
