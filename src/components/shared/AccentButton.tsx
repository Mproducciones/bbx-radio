'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { accentPrimaryButtonStyle, accentSecondaryButtonStyle } from '@/lib/accentUi'

type AccentButtonProps = {
  accent?: string
  highlight?: string
  variant?: 'primary' | 'secondary'
  href?: string
  children: ReactNode
  fullWidth?: boolean
  className?: string
  shimmer?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-[0.97] disabled:opacity-50 relative overflow-hidden'

export function AccentButton({
  accent = '#db8918',
  highlight,
  variant = 'primary',
  href,
  children,
  fullWidth,
  className = '',
  shimmer = true,
  type = 'button',
  ...rest
}: AccentButtonProps) {
  const sizeClass = fullWidth ? 'w-full px-4 py-3' : 'px-4 py-2.5'
  const style =
    variant === 'primary'
      ? accentPrimaryButtonStyle(accent, highlight)
      : accentSecondaryButtonStyle(accent)

  const shimmerClass = shimmer && variant === 'primary' ? 'btn-shimmer' : ''
  const cls = `${base} ${sizeClass} ${shimmerClass} ${className}`.trim()

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={cls} style={style} {...rest}>
      {children}
    </button>
  )
}
