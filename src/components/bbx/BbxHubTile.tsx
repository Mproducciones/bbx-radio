'use client'

import { accentTileStyle } from '@/lib/accentUi'

type BbxHubTileProps = {
  value: string
  label: string
  subtitle?: string
  accent: string
  /** Tarjetas de acción (ej. WhatsApp): sin número grande arriba */
  emphasis?: 'stat' | 'action'
  onClick?: () => void
  href?: string
}

export function BbxHubTile({
  value,
  label,
  subtitle,
  accent,
  emphasis = 'stat',
  onClick,
  href,
}: BbxHubTileProps) {
  const className =
    'group relative w-full min-h-[5.75rem] rounded-xl px-3 py-3 text-left overflow-hidden transition-all active:scale-[0.98] hover:brightness-110 flex flex-col'

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

      {emphasis === 'stat' ? (
        <p
          className="relative font-display text-[1.35rem] leading-none tabular-nums tracking-wide"
          style={{ color: accent, textShadow: `0 0 20px ${accent}44` }}
        >
          {value}
        </p>
      ) : (
        <span
          className="relative self-start text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
          style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}
        >
          {value}
        </span>
      )}

      <p
        className={`relative text-white font-semibold leading-snug ${
          emphasis === 'action' ? 'text-sm mt-2' : 'text-sm mt-1.5'
        }`}
      >
        {label}
      </p>
      {subtitle && (
        <p className="relative text-white/55 text-xs mt-0.5 leading-snug flex-1">{subtitle}</p>
      )}
      {(onClick || href) && (
        <p
          className="relative text-[11px] font-semibold mt-2 tracking-wide opacity-75 group-hover:opacity-100 transition-opacity"
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
