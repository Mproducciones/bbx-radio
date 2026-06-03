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
}[] = [
  { id: 'overview', label: 'Resumen', short: 'Resumen', icon: <AdminIcons.chart />, color: '#40B9BF' },
  { id: 'live', label: 'En vivo', short: 'Vivo', icon: <AdminIcons.wave />, color: '#FF3860' },
  { id: 'commercial', label: 'Comercial', short: 'Ads', icon: <AdminIcons.megaphone />, color: '#db8918' },
  { id: 'comms', label: 'Comunicación', short: 'Push', icon: <AdminIcons.bell />, color: '#7D59B5' },
  { id: 'billing', label: 'Suscripción', short: 'BBX', icon: <AdminIcons.gift />, color: '#00D9A0' },
  { id: 'content', label: 'Panel de contenido', short: 'CMS', icon: <AdminIcons.music />, color: '#FF006E' },
]

function NavButton({
  active,
  label,
  icon,
  color,
  onClick,
  compact,
}: {
  active: boolean
  label: string
  icon: ReactNode
  color: string
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl text-left transition-all active:scale-[0.98] shrink-0 ${
        compact ? 'px-3 py-2.5' : 'w-full px-3 py-2.5'
      }`}
      style={{
        background: active ? `${color}18` : 'transparent',
        border: active ? `1px solid ${color}40` : '1px solid transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.55)',
      }}
    >
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: active ? `${color}22` : 'rgba(255,255,255,0.04)', color: active ? color : 'rgba(255,255,255,0.4)' }}
      >
        {icon}
      </span>
      <span className={`font-semibold truncate ${compact ? 'text-xs whitespace-nowrap' : 'text-sm'}`}>{label}</span>
    </button>
  )
}

export function AdminSidebarNav({
  active,
  onChange,
}: {
  active: AdminSection
  onChange: (s: AdminSection) => void
}) {
  return (
    <aside
      className="hidden lg:flex flex-col w-52 xl:w-56 shrink-0 sticky top-[57px] self-start max-h-[calc(100vh-57px)] py-4 pr-2"
    >
      <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-2">Menú</p>
      <nav className="flex flex-col gap-1">
        {ADMIN_SECTIONS.map(s => (
          <NavButton
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
        className="mt-auto mx-1 flex items-center gap-2 rounded-xl px-3 py-3 text-xs transition-opacity hover:opacity-90"
        style={{ background: 'rgba(18,140,126,0.12)', border: '1px solid rgba(18,140,126,0.25)', color: '#5eead4' }}
      >
        <span className="text-base">💬</span>
        <span className="font-semibold text-white/80">Soporte BBX</span>
      </a>
    </aside>
  )
}

export function AdminMobileNav({
  active,
  onChange,
}: {
  active: AdminSection
  onChange: (s: AdminSection) => void
}) {
  return (
    <div
      className="lg:hidden sticky top-[57px] z-40 -mx-4 px-4 py-2 backdrop-blur-xl border-b border-white/[0.06]"
      style={{ background: 'rgba(7,7,14,0.9)' }}
    >
      <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ADMIN_SECTIONS.map(s => (
          <NavButton
            key={s.id}
            active={active === s.id}
            label={s.short}
            icon={s.icon}
            color={s.color}
            onClick={() => onChange(s.id)}
            compact
          />
        ))}
      </nav>
    </div>
  )
}
