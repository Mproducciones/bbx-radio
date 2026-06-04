'use client'

import { motion } from 'framer-motion'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { accentTileStyle } from '@/lib/accentUi'
import { springSnappy } from '@/lib/motion/framer'

const TILE_MIN_H = 'min-h-[6.75rem]'

type BbxHubTileProps = {
  value: string
  label: string
  subtitle?: string
  hint?: string
  accent: string
  emphasis?: 'stat' | 'action'
  actionLabel?: string
  onClick?: () => void
  href?: string
  animate?: boolean
}

export function BbxHubTile({
  value,
  label,
  subtitle,
  hint,
  accent,
  emphasis = 'stat',
  actionLabel,
  onClick,
  href,
  animate = true,
}: BbxHubTileProps) {
  const isExternal = Boolean(href)
  const ctaText = actionLabel ?? (isExternal ? 'Abrir WhatsApp' : 'Ver más info')

  const className = [
    'group relative w-full rounded-xl px-2.5 py-2 text-left overflow-hidden',
    'flex flex-col items-stretch',
    TILE_MIN_H,
    'ring-1 ring-inset ring-white/[0.06]',
    'active:ring-2',
  ].join(' ')

  const dataAttrs = animate ? { 'data-animate': 'tile' as const } : {}
  const style = accentTileStyle(accent)
  const motionProps = {
    whileTap: { scale: 0.98 },
    whileHover: { y: -2 },
    transition: springSnappy,
  }

  const ariaLabel = isExternal
    ? `${label}. ${subtitle ?? ''} ${ctaText}`
    : `${label}. ${subtitle ?? ''}. Tocá para ${ctaText.toLowerCase()}`

  const inner = (
    <>
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent 88%)` }}
      />

      <span
        className="absolute top-2 right-2 text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded"
        style={{
          background: `${accent}20`,
          color: accent,
          border: `1px solid ${accent}35`,
        }}
      >
        Tocable
      </span>

      <div className="relative h-7 flex items-end shrink-0 pr-12">
        {emphasis === 'stat' ? (
          <p
            className="font-display text-xl leading-none tabular-nums tracking-wide"
            style={{ color: accent }}
          >
            {value}
          </p>
        ) : (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}45` }}
          >
            {value}
          </span>
        )}
      </div>

      <p className="relative text-xs font-semibold text-white leading-snug mt-1 line-clamp-1 pr-1">{label}</p>
      <p className="relative text-[10px] text-white/55 leading-snug mt-0.5 line-clamp-1">{subtitle ?? '\u00A0'}</p>
      {hint ? (
        <p className="relative text-[9px] text-white/35 mt-0.5 line-clamp-1">{hint}</p>
      ) : null}

      <div
        className="relative mt-auto pt-1.5 flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 transition-colors group-hover:brightness-110"
        style={{
          background: `color-mix(in srgb, ${accent} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 32%, transparent)`,
        }}
      >
        <span className="text-[9px] font-bold text-white/80 leading-tight">{ctaText}</span>
        {isExternal ? (
          <ExternalLink className="w-3 h-3 shrink-0 opacity-90" style={{ color: accent }} aria-hidden />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-90 group-hover:translate-x-0.5 transition-transform" style={{ color: accent }} aria-hidden />
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
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
      aria-label={ariaLabel}
      className={className}
      style={{ ...style, ['--tw-ring-color' as string]: `${accent}55` }}
      {...motionProps}
      {...dataAttrs}
    >
      {inner}
    </motion.button>
  )
}
