'use client'

import { accentTileStyle } from '@/lib/accentUi'

type BbxHubTileProps = {
  value: string
  label: string
  subtitle?: string
  accent: string
  onClick?: () => void
  href?: string
}

export function BbxHubTile({ value, label, subtitle, accent, onClick, href }: BbxHubTileProps) {
  const className =
    'group relative w-full rounded-xl px-3 py-2.5 text-left overflow-hidden transition-all active:scale-[0.98] hover:brightness-110'

  const inner = (
    <>
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-90"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent 85%)` }}
      />
      <div
        className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-2xl"
        style={{ background: accent }}
      />
      <p
        className="relative font-display text-lg leading-none tabular-nums"
        style={{ color: accent, textShadow: `0 0 24px ${accent}55` }}
      >
        {value}
      </p>
      <p className="relative text-white text-[11px] font-semibold mt-1 leading-tight">{label}</p>
      {subtitle && <p className="relative text-white/45 text-[10px] mt-0.5 leading-snug">{subtitle}</p>}
      {(onClick || href) && (
        <p
          className="relative text-[9px] font-bold mt-2 tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity"
          style={{ color: accent }}
        >
          Ver detalle →
        </p>
      )}
    </>
  )

  const style = accentTileStyle(accent)

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {inner}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {inner}
    </button>
  )
}
