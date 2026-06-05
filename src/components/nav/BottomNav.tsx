'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { APP_PRIMARY_NAV_ROUTES } from '@/lib/appNavRoutes'
import { useAppMoreActive } from '@/components/nav/AppMoreSheet'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { FEATURES } from '@/lib/plan'

const TAB_META: Record<
  string,
  { label: string; shortLabel?: string; icon: ComponentType<{ className?: string }> }
> = {
  '/':             { label: 'En Vivo',      shortLabel: 'En Vivo',   icon: LiveIcon },
  '/programacion': { label: 'Programación', shortLabel: 'Grilla',    icon: ScheduleIcon },
  '/participa':    { label: 'Participa',    shortLabel: 'Participa', icon: ParticipaIcon },
  '/saludos':      { label: 'Saludos',      shortLabel: 'Saludos',   icon: SaludosIcon },
}

const TABS = APP_PRIMARY_NAV_ROUTES.map(href => ({
  href,
  label: TAB_META[href].shortLabel ?? TAB_META[href].label,
  icon: TAB_META[href].icon,
}))

const TAB_CLASS =
  'app-bottom-nav__tab flex-1 flex flex-col items-center justify-center relative py-1.5 rounded-xl transition-colors min-w-0'

function NavTabContent({
  active,
  label,
  icon: Icon,
  layoutId,
}: {
  active: boolean
  label: string
  icon: ComponentType<{ className?: string }>
  layoutId: string
}) {
  return (
    <>
      {active && (
        <motion.div
          layoutId={layoutId}
          className="app-bottom-nav__pill"
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
        />
      )}
      <div className="relative flex flex-col items-center gap-0.5 px-0.5">
        <Icon className="w-[17px] h-[17px] flex-shrink-0" />
        <span className="app-bottom-nav__label text-[8px] font-semibold leading-none tracking-wide truncate max-w-full">
          {label}
        </span>
      </div>
    </>
  )
}

export function BottomNav({
  onMoreOpen,
  onNavInteract,
}: {
  onMoreOpen?: () => void
  onNavInteract?: () => void
}) {
  const pathname = usePathname()
  const { openTv, isTvOpen } = useRadioPlayerContext()
  const moreActive = useAppMoreActive(pathname)
  const tvActive = isTvOpen || pathname.startsWith('/tv')

  if (pathname.startsWith('/studio') || pathname.startsWith('/admin') || pathname.startsWith('/bbx')) return null

  return (
    <nav
      className="app-bottom-nav app-bottom-nav--six shrink-0 w-full min-w-0 z-[1000] md:hidden border-t border-white/[0.06] overflow-hidden"
      style={{
        paddingBottom: 'var(--app-safe-bottom)',
        background: 'rgba(7,7,14,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="app-bottom-nav__inner px-1 flex items-center h-[var(--app-nav-h)] overflow-x-hidden min-w-0 gap-0">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavInteract}
              className={TAB_CLASS}
              style={{ color: isActive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.28)' }}
              aria-current={isActive ? 'page' : undefined}
            >
              <NavTabContent active={isActive} label={label} icon={Icon} layoutId="nav-tab-pill" />
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => { onNavInteract?.(); openTv() }}
          className={TAB_CLASS}
          style={{ color: tvActive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.28)' }}
          aria-label="Bienvenida TV en vivo"
          aria-pressed={isTvOpen}
        >
          <NavTabContent active={tvActive} label="TV" icon={TvNavIcon} layoutId="nav-tv-pill" />
        </button>

        {FEATURES.publicidad && (
          <button
            type="button"
            onClick={() => onMoreOpen?.()}
            className={TAB_CLASS}
            style={{ color: moreActive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.28)' }}
            aria-label="Publicidad y patrocinadores"
            aria-haspopup="dialog"
          >
            <NavTabContent active={moreActive} label="Más" icon={MoreNavIcon} layoutId="nav-more-pill" />
          </button>
        )}
      </div>
    </nav>
  )
}

function TvNavIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
    </svg>
  )
}

function MoreNavIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6 10h4v-4h-4v4zm0-6h4v-4h-4v4zM16 8h4V4h-4v4z" />
    </svg>
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
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
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
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  )
}
