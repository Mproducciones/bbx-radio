'use client'

import { motion } from 'framer-motion'
import { ChevronRight, ExternalLink, type LucideIcon } from 'lucide-react'
import { springSnappy } from '@/lib/motion/framer'

type BbxHubTileProps = {
  value: string
  label: string
  subtitle?: string
  accent: string
  icon?: LucideIcon
  variant?: 'default' | 'featured'
  actionLabel?: string
  onClick?: () => void
  href?: string
  animate?: boolean
}

export function BbxHubTile({
  value,
  label,
  subtitle,
  accent,
  icon: Icon,
  variant = 'default',
  actionLabel,
  onClick,
  href,
  animate = true,
}: BbxHubTileProps) {
  const isExternal = Boolean(href)
  const isFeatured = variant === 'featured'
  const ctaText = actionLabel ?? (isExternal ? 'Abrir WhatsApp' : 'Ver detalle')

  const ariaLabel = isExternal
    ? `${label}. ${subtitle ?? ''} ${ctaText}`
    : `${label}. ${subtitle ?? ''}. Tocá para ver detalle`

  const motionProps = {
    whileTap: { scale: 0.985 },
    whileHover: { y: isFeatured ? 0 : -2 },
    transition: springSnappy,
  }

  const dataAttrs = animate ? { 'data-animate': 'tile' as const } : {}

  const featuredStyle = {
    background:
      'linear-gradient(135deg, rgba(18,140,126,0.2) 0%, rgba(34,197,94,0.08) 42%, rgba(7,7,14,0.94) 100%)',
    border: '1px solid rgba(37,211,102,0.32)',
    boxShadow:
      '0 14px 44px -18px rgba(34,197,94,0.38), inset 0 1px 0 rgba(255,255,255,0.08)',
  } as const

  const defaultStyle = {
    background:
      'linear-gradient(165deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 40%, rgba(7,7,14,0.72) 100%)',
    border: `1px solid color-mix(in srgb, ${accent} 26%, rgba(255,255,255,0.07))`,
    boxShadow: `0 12px 36px -20px color-mix(in srgb, ${accent} 32%, transparent), inset 0 1px 0 rgba(255,255,255,0.06)`,
  } as const

  const className = [
    'group relative w-full overflow-hidden text-left bbx-hub-tile',
    'ring-1 ring-inset ring-white/[0.05] active:ring-white/[0.1]',
    isFeatured
      ? 'bbx-hub-tile--featured rounded-2xl px-3.5 py-3 flex flex-row items-center gap-3 min-h-[4.25rem]'
      : 'rounded-2xl px-3 py-3 flex flex-col min-h-[7.25rem]',
  ].join(' ')

  const defaultInner = (
    <>
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent 8%, ${accent}70, transparent 92%)` }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        {Icon ? (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
              color: accent,
            }}
          >
            <Icon className="w-4 h-4" strokeWidth={2.25} aria-hidden />
          </div>
        ) : null}
        <ChevronRight
          className="w-4 h-4 shrink-0 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all ml-auto"
          strokeWidth={2.5}
          aria-hidden
        />
      </div>

      <p
        className="font-display text-[1.35rem] leading-none tabular-nums tracking-wide"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-[13px] font-semibold text-white mt-1.5 leading-tight">{label}</p>
      {subtitle ? (
        <p className="text-[10px] text-white/42 mt-1 leading-snug line-clamp-2">{subtitle}</p>
      ) : null}
    </>
  )

  const featuredInner = (
    <>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: 'rgba(37,211,102,0.16)',
          border: '1px solid rgba(37,211,102,0.35)',
          color: '#25D366',
        }}
      >
        {Icon ? <Icon className="w-5 h-5" strokeWidth={2.25} aria-hidden /> : null}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-white leading-tight">{label}</p>
          <span
            className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
            style={{
              background: 'rgba(37,211,102,0.14)',
              color: '#4ade80',
              border: '1px solid rgba(37,211,102,0.28)',
            }}
          >
            {value}
          </span>
        </div>
        {subtitle ? (
          <p className="text-[11px] text-white/50 mt-0.5 leading-snug line-clamp-1">{subtitle}</p>
        ) : null}
      </div>

      <div
        className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-white/90"
        style={{
          background: 'rgba(37,211,102,0.18)',
          border: '1px solid rgba(37,211,102,0.32)',
        }}
      >
        {ctaText}
        {isExternal ? (
          <ExternalLink className="w-3 h-3 opacity-90" aria-hidden />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 opacity-90" aria-hidden />
        )}
      </div>
    </>
  )

  const inner = isFeatured ? featuredInner : defaultInner
  const style = isFeatured ? featuredStyle : defaultStyle

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
      style={{ ...style, ['--tw-ring-color' as string]: `${accent}44` }}
      {...motionProps}
      {...dataAttrs}
    >
      {inner}
    </motion.button>
  )
}
