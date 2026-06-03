'use client'

import { accentTileStyle } from '@/lib/accentUi'

const TILE_H = 'h-[7.75rem]'

type BbxHubTileProps = {
  value: string
  label: string
  subtitle?: string
  accent: string
  emphasis?: 'stat' | 'action'
  onClick?: () => void
  href?: string
  animate?: boolean
}

export function BbxHubTile({
  value,
  label,
  subtitle,
  accent,
  emphasis = 'stat',
  onClick,
  href,
  animate = true,
}: BbxHubTileProps) {
  const className = [
    'group relative w-full rounded-xl px-3 py-3 text-left overflow-hidden',
    'transition-[filter,transform] active:scale-[0.98] hover:brightness-105',
    'flex flex-col items-stretch',
    TILE_H,
    animate ? '' : '',
  ].join(' ')

  const dataAttrs = animate ? { 'data-bbx-animate': 'tile' as const } : {}

  const inner = (
    <>
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent 88%)` }}
      />

      <div className="relative h-9 flex items-end shrink-0">
        {emphasis === 'stat' ? (
          <p
            className="font-display text-2xl leading-none tabular-nums tracking-wide"
            style={{ color: accent }}
          >
            {value}
          </p>
        ) : (
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md leading-none"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}45` }}
          >
            {value}
          </span>
        )}
      </div>

      <p className="relative text-sm font-semibold text-white leading-snug mt-2 line-clamp-1">{label}</p>
      <p className="relative text-xs text-white/55 leading-snug mt-0.5 line-clamp-2 flex-1 min-h-[2rem]">
        {subtitle ?? '\u00A0'}
      </p>

      <p
        className="relative text-[11px] font-semibold mt-auto pt-2 opacity-70 group-hover:opacity-100"
        style={{ color: accent }}
      >
        Ver detalle →
      </p>
    </>
  )

  const style = accentTileStyle(accent)

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        {...dataAttrs}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style} {...dataAttrs}>
      {inner}
    </button>
  )
}
