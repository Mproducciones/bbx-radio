'use client'

import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { HlsPlayer } from '@/components/player/HlsPlayer'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { InterstitialPopup } from '@/components/ads/InterstitialPopup'
import {
  SocialLinks,
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  WhatsAppIcon,
} from '@/components/nav/SocialLinks'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO, NOW_PLAYING, PROGRAMS, RADIO_TV_HLS } from '@/lib/radioConfig'

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
      <InterstitialPopup showAfter={5} />
      <main className="min-h-screen bg-[var(--color-ink-900)] px-4 py-4 max-w-md md:max-w-3xl mx-auto flex flex-col gap-4">
        {/* Header + player only on mobile — desktop shows them in the sidebar */}
        <header className="md:hidden flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-white leading-none">{RADIO.name}</h1>
            <p className="text-[var(--color-ink-400)] text-xs mt-1">{RADIO.slogan}</p>
          </div>
          <div className="relative">
            <span className="font-display text-[var(--color-mag-400)] text-3xl select-none pointer-events-none">{RADIO.frequency}</span>
            <a
              href="/bbx"
              className="absolute inset-0 -inset-x-3 -inset-y-2"
              style={{ touchAction: 'manipulation' }}
              aria-label="Panel BBX"
              tabIndex={-1}
            />
          </div>
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

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 border border-[#25D366]/30 p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/10 via-transparent to-[#25D366]/10 animate-gradient" />
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#25D366] rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30">
                <WhatsAppIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-base mb-1">¿Quieres pedir una canción?</p>
              <p className="text-[var(--color-ink-300)] text-xs">Contacta directamente al locutor por WhatsApp</p>
            </div>
            <a
              href="https://wa.me/56950291592"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#128C7E] hover:bg-[#0e7a6d] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#128C7E]/30 transition-all duration-300 hover:scale-105 flex-shrink-0"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        <footer className="text-center text-[var(--color-ink-500)] text-xs pb-4 flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-ink-700)]">
          <SocialLinks links={SOCIAL_LINKS} />
          <span className="text-[var(--color-ink-400)]">Powered by BBX</span>
        </footer>
      </main>
    </>
  )
}