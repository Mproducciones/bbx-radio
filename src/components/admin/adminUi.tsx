'use client'

import type { ReactNode, SVGProps } from 'react'

export function AdminPageBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: '#07070E' }} />
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 15% -5%, rgba(219,137,24,0.14), transparent 55%), radial-gradient(ellipse 55% 35% at 95% 5%, rgba(64,185,191,0.1), transparent 50%), radial-gradient(ellipse 40% 30% at 50% 100%, rgba(125,89,181,0.08), transparent 55%)',
        }}
      />
    </>
  )
}

export function AdminCard({
  children,
  className = '',
  accent,
}: {
  children: ReactNode
  className?: string
  accent?: string
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden backdrop-blur-md ${className}`}
      style={{
        background: 'rgba(14, 14, 22, 0.92)',
        border: `1px solid ${accent ? `${accent}30` : 'rgba(255,255,255,0.07)'}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      }}
    >
      {accent && (
        <div className="h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${accent}, transparent 80%)` }} />
      )}
      {children}
    </div>
  )
}

export function AdminCardHeader({
  title,
  icon,
  badges,
  action,
}: {
  title: string
  icon?: ReactNode
  badges?: ReactNode
  action?: ReactNode
}) {
  return (
    <div
      className="px-4 pt-4 pb-3 flex items-center justify-between gap-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(219,137,24,0.12)', color: '#db8918' }}
          >
            {icon}
          </div>
        )}
        <p className="text-white font-semibold text-sm truncate">{title}</p>
        {badges}
      </div>
      {action}
    </div>
  )
}

export function AdminSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.2em] shrink-0">{children}</p>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
    </div>
  )
}

export function AdminKpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-2 sm:gap-3">{children}</div>
}

export function AdminKpi({
  value,
  sub,
  color,
  icon,
}: {
  value: number | string
  sub: string
  color: string
  icon: ReactNode
}) {
  return (
    <div
      className="rounded-xl p-2.5 sm:p-3.5 text-center min-w-0 transition-transform active:scale-[0.98]"
      style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${color}22` }}
    >
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-1.5 sm:mb-2 rounded-lg flex items-center justify-center"
        style={{ background: `${color}14`, color }}
      >
        {icon}
      </div>
      <p className="font-display text-xl sm:text-2xl text-white leading-none tabular-nums">{value}</p>
      <p className="text-[8px] sm:text-[10px] mt-1 leading-tight font-medium" style={{ color: `${color}cc` }}>
        {sub}
      </p>
    </div>
  )
}

export function AdminBadge({
  children,
  color = '#db8918',
}: {
  children: ReactNode
  color?: string
}) {
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
      style={{ background: `${color}22`, color, border: `1px solid ${color}35` }}
    >
      {children}
    </span>
  )
}

export function AdminGhostButton({
  children,
  onClick,
  href,
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
}) {
  const cls =
    'text-white/45 hover:text-white text-xs rounded-lg px-2.5 py-1.5 transition-colors border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.03]'
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}

export function AdminSpinner({ color = '#db8918' }: { color?: string }) {
  return (
    <div className="py-8 flex justify-center">
      <div
        className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${color}55`, borderTopColor: 'transparent' }}
      />
    </div>
  )
}

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props} />
  )
}

export const AdminIcons = {
  radio: () => (
    <IconBase>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </IconBase>
  ),
  users: () => (
    <IconBase>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  ),
  music: () => (
    <IconBase>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </IconBase>
  ),
  wave: () => (
    <IconBase>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </IconBase>
  ),
  megaphone: () => (
    <IconBase>
      <path d="M3 11v2a2 2 0 0 0 2 2h1l4 4V3L6 7H5a2 2 0 0 0-2 2z" />
      <path d="M13 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M16.5 6a8 8 0 0 1 0 12" />
    </IconBase>
  ),
  bell: () => (
    <IconBase>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </IconBase>
  ),
  chart: () => (
    <IconBase>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </IconBase>
  ),
  gift: () => (
    <IconBase>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 12 8 12 8s3-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </IconBase>
  ),
  hand: () => (
    <IconBase>
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10V5a2 2 0 0 0-4 0v9a8 8 0 0 0 16 0v-5a2 2 0 0 0-4 0" />
    </IconBase>
  ),
  poll: () => (
    <IconBase>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </IconBase>
  ),
}
