'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { APP_NAV_ROUTES } from '@/lib/appNavRoutes'

const TAB_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  '/':             { label: 'En Vivo',   icon: LiveIcon },
  '/programacion': { label: 'Grilla',    icon: ScheduleIcon },
  '/participa':    { label: 'Participa', icon: ParticipaIcon },
  '/saludos':      { label: 'Saludos',   icon: SaludosIcon },
  '/replay':       { label: 'Replay',    icon: ReplayIcon },
  '/tv':           { label: 'TV',        icon: TvIcon },
  '/anunciate':    { label: 'Anuncia',   icon: BusinessIcon },
}

const TABS = APP_NAV_ROUTES.map(href => ({
  href,
  label: TAB_META[href].label,
  icon: TAB_META[href].icon,
}))

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/studio') || pathname.startsWith('/admin') || pathname.startsWith('/bbx')) return null

  return (
    <nav
      className="app-bottom-nav shrink-0 w-full min-w-0 z-[1000] md:hidden border-t border-white/[0.06] overflow-hidden"
      style={{
        paddingBottom: 'var(--app-safe-bottom)',
        background: 'rgba(7,7,14,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="app-bottom-nav__inner px-1 flex items-center h-[var(--app-nav-h)] overflow-x-hidden min-w-0">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center relative py-1.5 rounded-xl transition-colors min-w-0 max-w-[14.28%]"
              style={{ color: isActive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.28)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-1 rounded-xl"
                  style={{ background: 'rgba(219,137,24,0.1)', border: '1px solid rgba(219,137,24,0.18)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}

              <div className="relative flex flex-col items-center gap-0.5 px-0.5">
                <Icon className="w-[17px] h-[17px] flex-shrink-0" />
                <span className="text-[7px] font-semibold leading-none tracking-wide truncate max-w-full">
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
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

function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  )
}

function ParticipaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
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
