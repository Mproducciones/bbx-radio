'use client'

import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { HlsPlayer } from '@/components/player/HlsPlayer'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import {
  SocialLinks,
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  WhatsAppIcon,
} from '@/components/nav/SocialLinks'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO, NOW_PLAYING, PROGRAMS, RADIO_TV_HLS } from '@/lib/radioConfig'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/RadioBienvenida', icon: FacebookIcon, color: '#1877F2' },
  { label: 'Instagram', href: 'https://www.instagram.com/radiobienvenida/', icon: InstagramIcon, color: '#E1306C' },
  { label: 'Twitter / X', href: 'https://twitter.com/BienvenidaFM', icon: TwitterXIcon, color: '#AAAABB' },
  { label: 'WhatsApp', href: 'https://wa.me/56950291592', icon: WhatsAppIcon, color: '#25D366' },
]

export default function HomePage() {
  const { isPlaying, isLoading, hasError, volume, analyser, isTvOpen, openTv, closeTv, toggle, setVolume, play } = useRadioPlayerContext()

  const handleRadioToggle = () => {
    if (isTvOpen) { closeTv(); play(); return }
    toggle()
  }

  return (
    <>
<main className="min-h-screen bg-[var(--color-ink-900)] px-4 py-4 max-w-md md:max-w-3xl mx-auto flex flex-col gap-4">
        {/* Header + player only on mobile — desktop shows them in the sidebar */}
        <header className="md:hidden flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-white leading-none">{RADIO.name}</h1>
            <p className="text-[var(--color-ink-400)] text-xs mt-1">{RADIO.slogan}</p>
          </div>
          <button
            onClick={() => { window.location.href = '/bbx' }}
            onContextMenu={(e) => e.preventDefault()}
            className="font-display text-[var(--color-mag-400)] text-3xl bg-transparent border-0 p-0 m-0 outline-none cursor-pointer leading-none"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none' as any,
              touchAction: 'manipulation',
              fontFamily: 'var(--font-display)',
            }}
            tabIndex={-1}
            aria-hidden="true"
          >
            {RADIO.frequency}
          </button>
        </header>

        <RotatingBanner interval={5} position="top" />

        <div className="md:hidden">
          <NowPlayingCard
            radio={RADIO}
            nowPlaying={NOW_PLAYING}
            isPlaying={isPlaying}
            isLoading={isLoading}
            hasError={hasError}
            volume={volume}
            analyser={analyser}
            onToggle={handleRadioToggle}
            onVolumeChange={setVolume}
          />
        </div>

        <RotatingBanner interval={5} position="middle" />

        {/* Bienvenida TV Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="pulso-badge-live">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mag-400)]" style={{ animation: 'var(--animate-live-dot)' }} />
              Bienvenida TV
            </span>
            <button
              onClick={() => { isTvOpen ? closeTv() : openTv() }}
              className="pulso-btn pulso-btn-ghost text-xs px-3 py-1.5 h-auto"
            >
              {isTvOpen ? 'Cerrar ✕' : 'Ver transmisión ▶'}
            </button>
          </div>
          {isTvOpen && <HlsPlayer src={RADIO_TV_HLS} title="Bienvenida TV en vivo" shouldPlay />}
        </div>

        <ProgramSchedule programs={PROGRAMS} />

        <RotatingBanner interval={5} position="bottom" />

        <SongRequestForm />

        <footer className="text-center text-[var(--color-ink-500)] text-xs pb-4 flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-ink-700)]">
          <SocialLinks links={SOCIAL_LINKS} />
          <span className="text-[var(--color-ink-400)]">Powered by BBX</span>
        </footer>
      </main>
    </>
  )
}