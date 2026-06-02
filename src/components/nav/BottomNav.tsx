'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { FEATURES } from '@/lib/plan'

const ALL_TABS = [
  { href: '/',          label: 'En Vivo',   icon: LiveIcon,     show: true },
  { href: '/saludos',   label: 'Saludos',   icon: SaludosIcon,  show: true },
  { href: '/replay',    label: 'Replay',    icon: ReplayIcon,   show: true },
  { href: '/tv',        label: 'TV',        icon: TvIcon,       show: true },
  { href: '/anunciate', label: 'Anunciate', icon: BusinessIcon, show: FEATURES.publicidad },
]

const TABS = ALL_TABS.filter(t => t.show)

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/studio') || pathname.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0"
        style={{
          background: 'rgba(7,7,14,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }} />

      <div className="relative max-w-md mx-auto px-2 flex items-center h-[62px] gap-1">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center relative py-2 rounded-2xl transition-colors"
              style={{ color: isActive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.28)' }}
            >
              {/* Pill background del item activo */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-1 rounded-xl"
                  style={{ background: 'rgba(219,137,24,0.1)', border: '1px solid rgba(219,137,24,0.18)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}

              <div className="relative flex flex-col items-center gap-1">
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-semibold leading-none tracking-wide">{label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  )
}

function LiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-2.5-5.5L16 12l-6.5-3.5v7z" />
    </svg>
  )
}

function SaludosIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  )
}

function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
    </svg>
  )
}

function TvIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7l7 4z"/>
    </svg>
  )
}

function BusinessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
    </svg>
  )
}
