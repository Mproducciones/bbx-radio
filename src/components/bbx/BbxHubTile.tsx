'use client'

import { motion } from 'framer-motion'
import { accentTileStyle } from '@/lib/accentUi'
import { springSnappy } from '@/lib/motion/framer'

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
    'flex flex-col items-stretch',
    TILE_H,
  ].join(' ')

  const dataAttrs = animate ? { 'data-animate': 'tile' as const } : {}
  const style = accentTileStyle(accent)
  const motionProps = {
    whileTap: { scale: 0.97 },
    whileHover: { y: -2 },
    transition: springSnappy,
  }

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
        className="relative text-[11px] font-semibold mt-auto pt-2 opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ color: accent }}
      >
        Ver detalle →
      </p>
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        {...motionProps}
        {...dataAttrs}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={className}
      style={style}
      {...motionProps}
      {...dataAttrs}
    >
      {inner}
    </motion.button>
  )
}
