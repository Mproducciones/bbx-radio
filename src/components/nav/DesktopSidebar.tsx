'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NowPlayingCard } from '@/components/player/NowPlayingCard'
import {
  SocialLinks,
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  WhatsAppIcon,
} from '@/components/nav/SocialLinks'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { RADIO, NOW_PLAYING } from '@/lib/radioConfig'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'En Vivo', icon: LiveIcon },
  { href: '/noticias', label: 'Noticias', icon: NewsIcon },
  { href: '/eventos', label: 'Eventos', icon: EventsIcon },
  { href: '/replay', label: 'Replay', icon: ReplayIcon },
  { href: '/anunciate', label: 'Publicidad', icon: BusinessIcon },
]

const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/RadioBienvenida', icon: FacebookIcon, color: '#1877F2' },
  { label: 'Instagram', href: 'https://www.instagram.com/radiobienvenida/', icon: InstagramIcon, color: '#E1306C' },
  { label: 'Twitter / X', href: 'https://twitter.com/BienvenidaFM', icon: TwitterXIcon, color: '#AAAABB' },
  { label: 'WhatsApp', href: 'https://wa.me/56950291592', icon: WhatsAppIcon, color: '#25D366' },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const {
    isPlaying, isLoading, hasError, volume, analyser,
    isTvOpen, closeTv, toggle, setVolume, play,
  } = useRadioPlayerContext()

  if (pathname.startsWith('/studio') || pathname.startsWith('/admin')) return null

  const handleToggle = () => {
    if (isTvOpen) { closeTv(); play(); return }
    toggle()
  }

  return (
    <aside
      className="hidden md:flex flex-col w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[var(--color-ink-700)]"
      style={{ background: 'rgba(7, 7, 14, 0.98)' }}
    >
      {/* Brand header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="font-display text-xl text-white leading-none">{RADIO.name}</h1>
        <p className="text-[var(--color-ink-400)] text-xs mt-0.5">{RADIO.slogan}</p>
      </div>

      {/* Player */}
      <div className="px-4">
        <NowPlayingCard
          radio={RADIO}
          nowPlaying={NOW_PLAYING}
          isPlaying={isPlaying}
          isLoading={isLoading}
          hasError={hasError}
          volume={volume}
          analyser={analyser}
          onToggle={handleToggle}
          onVolumeChange={setVolume}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-colors text-sm font-medium',
                isActive
                  ? 'bg-[var(--color-mag-400)]/10 text-[var(--color-mag-400)]'
                  : 'text-[var(--color-ink-300)] hover:text-white hover:bg-[var(--color-ink-700)]/50'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mag-400)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-[var(--color-ink-700)]">
        <SocialLinks links={SOCIAL} />
        <p className="text-[var(--color-ink-500)] text-[10px] mt-3 text-center">
          Powered by BBX
        </p>
      </div>
    </aside>
  )
}

function LiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-2.5-5.5L16 12l-6.5-3.5v7z" />
    </svg>
  )
}

function NewsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
    </svg>
  )
}

function EventsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  )
}

function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  )
}

function BusinessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.47 0 12.36 0c-1.73 0-3.24.87-4.36 2.18L6 5H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7.64-3.28C12.58 1.49 13.42 1 14.36 1c1.67 0 3 1.33 3 3 0 .47-.1.92-.26 1.32-.04.1-.12.36-.1.68H9.39c.01-.29-.08-.57-.16-.71C9 4.9 9 4.45 9 4c0-.66.31-1.26.79-1.71.17-.16.37-.3.57-.57zM20 20H4V8h16v12z" />
    </svg>
  )
}
