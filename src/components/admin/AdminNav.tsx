'use client'

import type { ReactNode } from 'react'
import { AdminIcons } from './adminUi'

export type AdminSection = 'overview' | 'live' | 'commercial' | 'comms' | 'billing' | 'content'

export const ADMIN_SECTIONS: {
  id: AdminSection
  label: string
  short: string
  icon: ReactNode
  color: string
  superAdminOnly?: boolean
}[] = [
  { id: 'overview', label: 'Resumen', short: 'Resumen', icon: <AdminIcons.chart />, color: '#40B9BF' },
  { id: 'live', label: 'En vivo', short: 'Vivo', icon: <AdminIcons.wave />, color: '#FF3860' },
  { id: 'commercial', label: 'Comercial', short: 'Ads', icon: <AdminIcons.megaphone />, color: '#db8918' },
  { id: 'comms', label: 'Comunicación', short: 'Push', icon: <AdminIcons.bell />, color: '#7D59B5' },
  { id: 'billing', label: 'Suscripciones', short: 'BBX', icon: <AdminIcons.gift />, color: '#00D9A0', superAdminOnly: true },
  { id: 'content', label: 'Panel de contenido', short: 'CMS', icon: <AdminIcons.music />, color: '#FF006E' },
]

export function getAdminSections(superAdmin: boolean) {
  return ADMIN_SECTIONS.filter(s => !s.superAdminOnly || superAdmin)
}

function SidebarNavItem({
  active,
  label,
  icon,
  color,
  onClick,
}: {
  active: boolean
  label: string
  icon: ReactNode
  color: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`admin-nav-item ${active ? 'is-active' : ''}`}
      style={{ '--nav-accent': color } as React.CSSProperties}
    >
      <span className="admin-nav-item__icon">{icon}</span>
      <span className="font-semibold text-sm truncate">{label}</span>
    </button>
  )
}

export function AdminSidebarNav({
  active,
  onChange,
  superAdmin = false,
}: {
  active: AdminSection
  onChange: (s: AdminSection) => void
  superAdmin?: boolean
}) {
  const sections = getAdminSections(superAdmin)
  return (
    <aside className="hidden lg:flex flex-col w-52 xl:w-56 shrink-0 sticky top-[57px] self-start max-h-[calc(100vh-57px)] py-4 pr-2">
      <div className="admin-sidebar-panel flex flex-col gap-1 min-h-[min(32rem,calc(100vh-8rem))]">
        <p className="admin-eyebrow px-2 mb-1">Studio</p>
        <nav className="flex flex-col gap-0.5">
          {sections.map(s => (
            <SidebarNavItem
              key={s.id}
              active={active === s.id}
              label={s.label}
              icon={s.icon}
              color={s.color}
              onClick={() => onChange(s.id)}
            />
          ))}
        </nav>
        <a
          href="https://wa.me/56922105555"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-support-link"
        >
          <span className="text-base leading-none" aria-hidden>💬</span>
          <span>Soporte BBX</span>
        </a>
      </div>
    </aside>
  )
}

export function AdminMobileNav({
  active,
  onChange,
  superAdmin = false,
}: {
  active: AdminSection
  onChange: (s: AdminSection) => void
  superAdmin?: boolean
}) {
  const sections = getAdminSections(superAdmin)
  return (
    <div className="lg:hidden sticky top-[57px] z-40 admin-nav-rail">
      <nav className="admin-nav-rail__inner" aria-label="Secciones del panel">
        {sections.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={`admin-nav-rail__item ${active === s.id ? 'is-active' : ''}`}
            style={{ '--nav-accent': s.color } as React.CSSProperties}
            aria-current={active === s.id ? 'page' : undefined}
          >
            <span className="admin-nav-rail__icon">{s.icon}</span>
            <span className="admin-nav-rail__label">{s.short}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
