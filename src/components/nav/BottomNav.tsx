'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { APP_PRIMARY_NAV_ROUTES } from '@/lib/appNavRoutes'
import { NavMoreSheet, useMoreNavActive } from '@/components/nav/NavMoreSheet'

const TAB_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  '/':             { label: 'En Vivo',       icon: LiveIcon },
  '/programacion': { label: 'Programación',  icon: ScheduleIcon },
  '/participa':    { label: 'Participa',     icon: ParticipaIcon },
  '/saludos':      { label: 'Saludos',       icon: SaludosIcon },
}

const TABS = APP_PRIMARY_NAV_ROUTES.map(href => ({
  href,
  label: TAB_META[href].label,
  icon: TAB_META[href].icon,
}))

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreActive = useMoreNavActive(pathname)

  if (pathname.startsWith('/studio') || pathname.startsWith('/admin') || pathname.startsWith('/bbx')) return null

  return (
    <>
      <nav
        className="app-bottom-nav shrink-0 w-full min-w-0 z-[1000] md:hidden border-t border-white/[0.06] overflow-hidden"
        style={{
          paddingBottom: 'var(--app-safe-bottom)',
          background: 'rgba(7,7,14,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="app-bottom-nav__inner px-1.5 flex items-center h-[var(--app-nav-h)] overflow-x-hidden min-w-0 gap-0.5">
          {TABS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center relative py-1.5 rounded-xl transition-colors min-w-0"
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
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="text-[9px] font-semibold leading-none tracking-wide truncate max-w-full">
                    {label}
                  </span>
                </div>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center relative py-1.5 rounded-xl transition-colors min-w-0"
            style={{ color: moreActive ? 'var(--color-mag-400)' : 'rgba(255,255,255,0.28)' }}
            aria-label="Más opciones"
            aria-expanded={moreOpen}
          >
            {moreActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-1 rounded-xl"
                style={{ background: 'rgba(219,137,24,0.1)', border: '1px solid rgba(219,137,24,0.18)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <div className="relative flex flex-col items-center gap-0.5 px-0.5">
              <MoreIcon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[9px] font-semibold leading-none tracking-wide">Más</span>
            </div>
          </button>
        </div>
      </nav>

      <NavMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}

function MoreIcon({ className }: { className?: string }) {
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
