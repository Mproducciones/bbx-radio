'use client'



import { NowPlayingCard } from '@/components/player/NowPlayingCard'

import { RadioLocaleBar } from '@/components/player/RadioLocaleBar'

import { TabContextBar } from '@/components/layout/TabContextBar'

import { EnVivoBootMotion } from '@/components/player/EnVivoBootMotion'

import { ClientOnly } from '@/components/ui/ClientOnly'

import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

import { RADIO, RADIO_TAGLINE } from '@/lib/radioConfig'

import { useNowPlaying } from '@/hooks/useNowPlaying'

import { EnVivoAdSlot } from '@/components/ads/EnVivoAdSlot'

import { SponsorDemoBar } from '@/components/ads/SponsorDemoBar'

import { AnunciateDiscoverBanner } from '@/components/ads/AnunciateDiscoverBanner'

import { PlayTapHint } from '@/components/player/PlayTapHint'

import { FEATURES } from '@/lib/plan'

import { WELCOME_LOGO_SRC } from '@/lib/animations/welcomeCanvas'



export function HomePageClient() {

  const { isPlaying, isLoading, hasError, analyser, toggle } = useRadioPlayerContext()

  const { current: nowPlaying } = useNowPlaying()



  return (

    <main className="envivo-home relative flex flex-col flex-1 min-h-0 w-full min-w-0 overflow-hidden md:min-h-[calc(100dvh-64px)]">

      <div className="envivo-mobile-stage md:hidden">
        <div className="envivo-mobile-backdrop md:hidden" aria-hidden />
        <EnVivoBootMotion artSrc={WELCOME_LOGO_SRC} labelArtSrc={WELCOME_LOGO_SRC} primary="#db8918">

          <header className="envivo-stage__header relative z-20 shrink-0">

            <TabContextBar />

            <SponsorDemoBar />

            <PlayTapHint />

            <div className="envivo-stage__meta">

              <AnunciateDiscoverBanner />

              <ClientOnly fallback={<div className="h-12 w-full shrink-0" aria-hidden />}>

                <RadioLocaleBar radio={RADIO} stage className="relative z-[4]" />

              </ClientOnly>

            </div>

          </header>



          <div className="envivo-stage__center relative z-10 flex flex-1 flex-col min-h-0 w-full">

            <ClientOnly fallback={<div className="flex-1 min-h-[12rem]" aria-hidden />}>

              <NowPlayingCard

                immersive

                radio={RADIO}

                nowPlaying={{

                  title: nowPlaying?.title ?? 'En Vivo',

                  artist: nowPlaying?.artist ?? RADIO_TAGLINE,

                  isLive: true,

                  startedAt: new Date(0),

                }}

                isPlaying={isPlaying}

                isLoading={isLoading}

                hasError={hasError}

                analyser={analyser}

                onToggle={toggle}

              />

            </ClientOnly>

          </div>



          {FEATURES.publicidad && (

            <footer className="envivo-stage__footer relative z-20 shrink-0">

              <ClientOnly>

                <EnVivoAdSlot />

              </ClientOnly>

            </footer>

          )}

        </EnVivoBootMotion>

      </div>



      {/* Desktop: panel central inmersivo */}

      <div className="hidden md:flex flex-col items-center justify-center min-h-[80vh] px-8 text-center relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none"

          style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(219,137,24,0.1) 0%, rgba(64,185,191,0.04) 40%, transparent 70%)' }} />



        <div className="relative mb-10" style={{ width: 120, height: 120 }}>

          {[0, 1, 2].map(i => (

            <span

              key={i}

              className="radio-wave absolute inset-0 rounded-full"

              style={{ color: '#db8918', animationDelay: `${i * 0.65}s` }}

            />

          ))}

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



        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 glass-amber">

          <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />

          <span className="text-[#db8918] text-[10px] font-black uppercase tracking-widest">Transmitiendo en vivo</span>

        </div>



        <h2 className="font-display text-gradient-gold leading-none mb-2 tracking-wide"

          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>

          {RADIO.name}

        </h2>

        <p className="text-[#40B9BF] font-bold text-xl mb-2">{RADIO.frequency}</p>

        <p className="text-white/30 text-sm mb-10">{RADIO.city}</p>



        <div className="flex flex-wrap gap-2 justify-center">

          {[

            { href: '/programacion', label: '📋 Programación', accent: '#db8918' },

            { href: '/participa',    label: '🎵 Participa',     accent: '#40B9BF' },

            { href: '/saludos',      label: '💬 Saludos',       accent: '#7D59B5' },

            ...(FEATURES.noticias

              ? [{ href: '/noticias', label: '📰 Noticias', accent: '#00D9A0' }]

              : []),

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


