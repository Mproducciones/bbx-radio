'use client'

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
    'group relative w-full rounded-xl p-3.5 md:p-4 text-left transition-all active:scale-[0.98] min-h-[84px] flex flex-col justify-center'
  const style = {
    background: '#0e0e16',
    border: `1px solid ${accent}28`,
    boxShadow: `0 4px 24px ${accent}08`,
  }

  const inner = (
    <>
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 0%, ${accent}14, transparent 65%)` }}
      />
      <p className="relative font-display text-[clamp(1.75rem,6vw,2.25rem)] leading-none" style={{ color: accent }}>
        {value}
      </p>
      <p className="relative text-white font-semibold text-xs mt-1.5 leading-tight">{label}</p>
      {subtitle && <p className="relative text-white/38 text-[10px] mt-0.5 leading-snug">{subtitle}</p>}
      {onClick && (
        <p className="relative text-[10px] font-bold mt-2 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
          Ver detalle →
        </p>
      )}
    </>
  )

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
