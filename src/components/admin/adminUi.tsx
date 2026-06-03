'use client'

import type { CSSProperties, ReactNode, SVGProps } from 'react'

export function AdminPageBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none admin-mesh" />
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 80% 20%, rgba(0,217,160,0.06), transparent 60%)',
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
  const style = accent ? ({ '--admin-accent': accent } as CSSProperties) : undefined
  return (
    <div className={`admin-card ${className}`.trim()} style={style}>
      {accent ? <div className="admin-card__stripe" aria-hidden /> : null}
      {children}
    </div>
  )
}

export function AdminCardHeader({
  title,
  icon,
  badges,
  action,
  accent = '#db8918',
}: {
  title: string
  icon?: ReactNode
  badges?: ReactNode
  action?: ReactNode
  accent?: string
}) {
  return (
    <div className="admin-card-header" style={{ '--admin-accent': accent } as CSSProperties}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon ? <div className="admin-card-header__icon">{icon}</div> : null}
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
          {badges ? <div className="flex flex-wrap gap-1.5 mt-1">{badges}</div> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

export function AdminSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="admin-section-title">
      <p className="admin-section-title__text">{children}</p>
      <div className="admin-section-title__line" aria-hidden />
    </div>
  )
}

export function AdminKpiGrid({ children }: { children: ReactNode }) {
  return <div className="admin-kpi-grid">{children}</div>
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
    <div className="admin-kpi" style={{ '--kpi-accent': color } as CSSProperties}>
      <div className="admin-kpi__icon">{icon}</div>
      <p className="font-display text-xl sm:text-2xl text-white leading-none tabular-nums">{value}</p>
      <p className="text-[8px] sm:text-[10px] mt-1 leading-tight font-semibold uppercase tracking-wide" style={{ color: `${color}cc` }}>
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
    <span className="admin-badge" style={{ '--badge-accent': color } as CSSProperties}>
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
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="admin-btn-ghost">
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className="admin-btn-ghost">
      {children}
    </button>
  )
}

export function AdminTabs({
  tabs,
  active,
  onChange,
  accent = '#db8918',
}: {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
  accent?: string
}) {
  return (
    <div className="admin-tabs" style={{ '--tab-accent': accent } as CSSProperties}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`admin-tab ${active === tab.key ? 'is-active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function AdminSegment({
  options,
  value,
  onChange,
  accent = '#db8918',
}: {
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (v: string | number) => void
  accent?: string
}) {
  return (
    <div className="admin-segment" style={{ '--segment-accent': accent } as CSSProperties}>
      {options.map(opt => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`admin-segment__btn ${value === opt.value ? 'is-active' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
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
